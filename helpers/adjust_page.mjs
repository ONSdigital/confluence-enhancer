
// Merge adjacent text nodes so split placeholders end up in the same node
function normalizeTextNodes(root) {
  if (!root || (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE)) {
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
  while (node = walker.nextNode()) {
    const next = node.nextSibling;
    if (next && next.nodeType === Node.TEXT_NODE) {
      node.nodeValue += next.nodeValue;
      next.parentNode.removeChild(next);
    }
  }
}

// Walk all text nodes under `root` and replace any literal key with its value
function replacePlaceholders(root = document.body) {
  normalizeTextNodes(root);

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    let text = node.nodeValue;
    let newText = text;

    // For each key in our variables map, do a global replace
    for (const key in variables) {
      if (!Object.prototype.hasOwnProperty.call(variables, key)) continue;
      const value = variables[key];
      // split/join is faster & avoids regex-escaping pitfalls
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
 * @param {Array<{key: string, value: string}>} pairsToReplace
 *        e.g. [{ key: 'ReplaceThisWithTheEpochNumber', value: '116' }, ...]
 */
export function runReplacementScript(pairsToReplace) {
  // Build our lookup map directly from the raw keys
  variables = pairsToReplace.reduce((acc, { key, value }) => {
    acc[key] = value;
    return acc;
  }, {});

  // 1) Run once on initial load
  if (window.AJS && AJS.toInit) {
    AJS.toInit(() => replacePlaceholders());
  } else {
    document.addEventListener('DOMContentLoaded', () => replacePlaceholders());
  }

  // 2) Observe for any new content or text changes
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      if (m.type === 'childList') {
        for (const node of m.addedNodes) {
          if (node.nodeType === Node.TEXT_NODE) {
            replacePlaceholders(node.parentNode);
          } else if (node.nodeType === Node.ELEMENT_NODE) {
            replacePlaceholders(node);
          }
        }
      } else if (m.type === 'characterData') {
        replacePlaceholders(m.target.parentNode);
      } else if (m.type === 'attributes' && m.attributeName === 'style') {
        replacePlaceholders(m.target);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true,
    attributeFilter: ['style']
  });
}

