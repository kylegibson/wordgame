var keys = {
    escape: 27,
    spacebar: 32,
    arrowRight: 39,
    arrowLeft: 37,
    backspace: 8
};

function WordGame(source) {
    this.source = source;
    this.currentWordIndex = -1;
    this.sets = [];
    this.currentSet = -1;
}

$.extend(WordGame.prototype, {
    init: function() {
        $.get(this.source).done(this.wordLoader.bind(this));
    },
    wordLoader: function(data) {
        this.sets = this.parseDataIntoSetsOfWords(data);
        this.displaySets();
    },
    wordIndexIsOutOfBounds: function(index) {
        var words = this.getWords();
        return index < 0 || index >= words.length;
    },
    getWords: function() {
        return this.sets[this.currentSet];
    },
    getWordAtIndex: function(index) {
        if (this.wordIndexIsOutOfBounds(index)) {
            return '';
        }
        var words = this.getWords();
        return words[index];
    },
    getCurrentWord: function() {
        return this.getWordAtIndex(this.currentWordIndex);
    },
    getNextWord: function() {
        return this.getWordAtIndex(this.currentWordIndex + 1);
    },
    getPreviousWord: function() {
        return this.getWordAtIndex(this.currentWordIndex - 1);
    },
    handleSetSelected: function(selectedSet) {
        this.currentSet = selectedSet;
        $('.previous').text('');
        $('.next').text(this.getNextWord());
        $('.word').text('');
        $('.set-chooser').addClass('hide');
        $('.set-display').removeClass('hide');
        $(document).on('keyup', this.keyUpHandler.bind(this));
    },
    displaySets: function() {
        var self = this;
        var chooser = $('.set-chooser');
        for(var i=0; i < this.sets.length; ++i) {
            var container = $('<ul>').data('set-id', i);
            for(var j=0; j < this.sets[i].length; ++j) {
                var item = $('<li>').text(this.sets[i][j]);
                container.append(item);
            }
            chooser.append(container);
        }
        chooser.click(function(e) {
            e.preventDefault();
            var selectedSet = $(e.target).parent().data('set-id');
            self.handleSetSelected(selectedSet);
        });
    },
    parseDataIntoSetsOfWords: function(data) {
        var rows = data.split('\n');
        var sets = [];
        for(var i=0; i < rows.length; ++i) {
            if (rows[i]) {
                sets.push(rows[i].split('\t'));
            }
        }
        // Transpose the array
        return sets[0].map(function(col, i) {
            return sets.map(function(row) {
                return row[i];
            });
        });
    },
    returnToSetSelection: function() {
        this.currentWordIndex = -1;
        this.currentSet = -1;
        $('.set-display').addClass('hide');
        $('.set-chooser').removeClass('hide');
    },
    keyUpHandler: function(e) {
        console.log(e.keyCode);

        if (this.isReturnToSetSelectionKey(e.keyCode)) {
            e.preventDefault();
            this.returnToSetSelection();
        }
        if (this.isNextWordKey(e.keyCode)) {
            e.preventDefault();
            if (!this.wordIndexIsOutOfBounds(this.currentWordIndex + 1)) {
                this.currentWordIndex++;
            }
            $('.word').text(this.getCurrentWord());
        }
        if (this.isPreviousWordKey(e.keyCode)) {
            e.preventDefault();
            if (!this.wordIndexIsOutOfBounds(this.currentWordIndex - 1)) {
                this.currentWordIndex--;
            }
            $('.word').text(this.getCurrentWord());
        }

        $('.next').text(this.getNextWord());
        if (this.currentWordIndex > 0) {
            $('.previous').text(this.getPreviousWord());
        } else {
            $('.previous').text('');
        }
    },
    isNextWordKey: function(keyCode) {
        return keyCode === keys.spacebar || keyCode == keys.arrowRight;
    },
    isPreviousWordKey: function(keyCode) {
        return keyCode === keys.backspace || keyCode == keys.arrowLeft;
    },
    isReturnToSetSelectionKey: function(keyCode) {
        return keyCode === keys.escape;
    },
});
