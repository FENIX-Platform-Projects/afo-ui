FMStyleUtils = {

    randomID: function() {
        return (Math.random().toString(36).substring(7) + Date.now()).toLocaleLowerCase();
    },

    replaceAll: function(text, stringToFind, stringToReplace) {
        return text.replace(new RegExp(stringToFind, 'g'), stringToReplace);
    }
}
