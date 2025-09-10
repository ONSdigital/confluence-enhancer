// Merge adjacent text nodes so split placeholders end up in the same node
function normalizeTextNodes(root) {
  if (
    !root ||
    (root.nodeType !== Node.ELEMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_NODE &&
      root.nodeType !== Node.DOCUMENT_FRAGMENT_NODE)
  ) {
    console.warn('normalizeTextNodes skipped on invalid root:', root);
    return;
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    const next = node.nextSibling;
    if (next && next.nodeType === Node.TEXT_NODE) {
      node.nodeValue += next.nodeValue;
      next.parentNode.removeChild(next);
    }
  }
}

// Walk all text nodes under `root` and replace any literal key with its value
function replacePlaceholders(root) {
  if (!root) return;
  normalizeTextNodes(root);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while ((node = walker.nextNode())) {
    const text = node.nodeValue;
    let newText = text;

    // For each key in our variables map, do a global replace
    for (const key in variables) {
      if (!Object.prototype.hasOwnProperty.call(variables, key)) continue;
      const value = variables[key];
      // split/join is fast & avoids regex-escaping pitfalls
      if (newText.includes(key)) {
        newText = newText.split(key).join(value);
      }
    }

    if (newText !== text) {
      node.nodeValue = newText;
    }
  }
}

// This object will hold literal keys → replacement strings
let variables = {};

/**
 * Resolve roots from a selector or element(s).
 * @param {string|Element|NodeListOf<Element>|Element[]} mainContentSelector
 * @returns {Element[]} array of root elements to operate on
 */
function resolveRoots(mainContentSelector) {
  // If a CSS selector string is provided
  if (typeof mainContentSelector === 'string') {
    const list = document.querySelectorAll(mainContentSelector);
    return list && list.length ? Array.from(list) : [];
  }

  // If a single Element was provided
  if (mainContentSelector instanceof Element) {
    return [mainContentSelector];
  }

  // If a NodeList or Array of Elements was provided
  if (
    (NodeList.prototype.isPrototypeOf(mainContentSelector) ||
      Array.isArray(mainContentSelector)) &&
    mainContentSelector.length
  ) {
    // Filter to Elements only
    return Array.from(mainContentSelector).filter((el) => el instanceof Element);
  }

  return [];
}

/**
 * Observe a single root and run replacements for relevant mutations.
 * @param {Element} root
 * @returns {MutationObserver}
 */
function createObserverForRoot(root) {
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            // Operate on the parent Element to walk text nodes properly
            const parent = node.parentNode instanceof Element ? node.parentNode : root;
            replacePlaceholders(parent);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            replacePlaceholders(node);
          }
        }
      } else if (m.type === 'characterData') {
        const parent = m.target.parentNode instanceof Element ? m.target.parentNode : root;
        replacePlaceholders(parent);
      } else if (m.type === 'attributes' && m.attributeName === 'style') {
        replacePlaceholders(m.target);
      }
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['style'],
  });

  return observer;
}

/**
 * Run the replacement script within the specified main content area(s).
 *
 * @param {Array<{key: string, value: string}>} pairsToReplace
 *        e.g. [{ key: 'ReplaceThisWithTheEpochNumber', value: '116' }, ...]
 * @param {string|Element|NodeListOf<Element>|Element[]} [mainContent='#main-content']
 *        CSS selector, Element, NodeList, or Array of Elements that define the main content area(s).
 *        If no matches are found, falls back to document.body.
 */
export function runReplacementScript(pairsToReplace, mainContent = '#main-content') {
  // Build our lookup map directly from the raw keys
  variables = pairsToReplace.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  // Resolve the roots we will operate on
  let roots = resolveRoots(mainContent);
  if (!roots.length) {
    console.warn(
      '[runReplacementScript] No elements matched mainContent; falling back to document.body'
    );
    roots = [document.body];
  }

  console.log('Main content roots:', roots);

  // A helper to run replacements across all roots
  const runOnAllRoots = () => {
    for (const root of roots) {
      replacePlaceholders(root);
    }
  };

  // 1) Run once on initial load, respecting AJS.toInit if present
  if (window.AJS && typeof AJS.toInit === 'function') {
    AJS.toInit(() => runOnAllRoots());
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runOnAllRoots, { once: true });
  } else {
    // DOM is already ready
    runOnAllRoots();
  }

  // 2) Observe each root for any new content or text changes
  const observers = roots.map((root) => createObserverForRoot(root));

  // Optionally return a small API to disconnect observers if needed by caller
  return {
    disconnect() {
      observers.forEach((obs) => obs.disconnect());
    },
    rerun() {
      runOnAllRoots();
    },
  };
}
