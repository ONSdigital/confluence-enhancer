

// Merge adjacent text nodes so that split placeholders like "$$" and "epoch_number"
// end up in the same node for matching
function normalizeTextNodes(root) {
  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  let node;
  while (node = walker.nextNode()) {
    let next = node.nextSibling;
    if (next && next.nodeType === Node.TEXT_NODE) {
      node.nodeValue += next.nodeValue;
      next.parentNode.removeChild(next);
    }
  }
}

// Walk all text nodes under `root` and replace $$VAR with variables[VAR]
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
    const text = node.nodeValue;
    if (!/\$\$\w+/.test(text)) continue;

    const newText = text.replace(
      /\$\$(\w+)/g,
      (_, varName) =>
        Object.prototype.hasOwnProperty.call(variables, varName)
          ? variables[varName]
          : `$$${varName}`
    );

    if (newText !== text) {
      node.nodeValue = newText;
    }
  }
}

let variables = {};

export function runReplacementScript(pairsToReplace) {
  // pairsToReplace: [ {'key': 'epoch_number', 'value': '116-ThisValueWasSucesffullyReplaced'} ]
  // The 'key' is what to match on the page
  // The 'value' is what to replace it with

  // Populate the variables object with user preferences
  variables = pairsToReplace.reduce((acc, {key, value}) => {
    // strip off the leading '$$' to get the varName
    const varName = key.startsWith('$$') ? key.slice(2) : key;
    acc[varName] = value;
    return acc;
  }, {});

  // 1) Run once on initial load (Confluence or standard DOMContentLoaded)
  if (window.AJS && AJS.toInit) {
    AJS.toInit(() => replacePlaceholders());
  } else {
    document.addEventListener('DOMContentLoaded', () => replacePlaceholders());
  }

  // 2) Observe for new nodes, text changes, or style toggles
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
      }
      else if (m.type === 'characterData') {
        replacePlaceholders(m.target.parentNode);
      }
      else if (m.type === 'attributes' && m.attributeName === 'style') {
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
