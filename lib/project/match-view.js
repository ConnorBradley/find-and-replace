const { Range, CompositeDisposable } = require('atom');
const etch = require('etch');
const {showIf} = require('./util');
const $ = etch.dom;

module.exports =
class MatchView {
  constructor({match, regex, replacePattern, isSelected, previewStyle, top}) {
    this.match = match;
    this.regex = regex;
    this.replacePattern = replacePattern;
    this.previewStyle = previewStyle;
    this.isSelected = isSelected;
    this.top = top;
    etch.initialize(this);
  }

  update({match, regex, replacePattern, previewStyle, isSelected, top}) {
    const changed =
      match !== this.match ||
      regex !== this.regex ||
      replacePattern !== this.replacePattern ||
      previewStyle !== this.previewStyle ||
      isSelected !== this.isSelected ||
      top !== this.top;

    if (changed) {
      this.match = match;
      this.regex = regex;
      this.replacePattern = replacePattern;
      this.previewStyle = previewStyle;
      this.isSelected = isSelected;
      this.top = top;
      etch.update(this);
    }
  }

  render() {
    const range = Range.fromObject(this.match.range);
    const matchStart = range.start.column - this.match.lineTextOffset;
    const matchEnd = range.end.column - this.match.lineTextOffset;
    const prefix = this.match.lineText.slice(0, matchStart).trimLeft();
    const suffix = this.match.lineText.slice(matchEnd);

    let replacementText = ''
    if (this.replacePattern && this.regex) {
      replacementText = this.match.matchText.replace(this.regex, this.replacePattern);
    } else if (this.replacePattern) {
      replacementText = this.replacePattern;
    }

    return (
      $.li(
        {
          key: range.toString(),
          dataset: {range: range.toString()},
          className: `search-result list-item ${this.isSelected ? 'selected' : ''}`,
          style: {
            position: 'absolute',
            top: `${this.top}px`,
            left: 0,
            right: 0
          }
        },

        $.span({className: 'line-number text-subtle'},
          range.start.row + 1
        ),

        $.span({className: 'preview', style: this.previewStyle},
          $.span({}, prefix),
          $.span({className: `match ${replacementText ? 'highlight-error' : 'highlight-info'}`},
            this.match.matchText
          ),
          $.span({className: 'replacement highlight-success', style: showIf(replacementText)},
            replacementText
          ),
          $.span({}, suffix)
        )
      )
    );
  }
};
