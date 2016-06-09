(function () {
    "use strict";

    module.exports = {
        /**
         * flattens a vector | [[r0c0, r0c1, ... , r0cn], ..., [rnc0, ..., rncn]] to [r0c0 ... rnrn],
         * does not deal with deeper levels of nesting.
         * @param vec
         * @returns {Array}
         */
        flattenVector: function (vec) {

            if (!Array.isArray(vec)){
                return vec;
            }

            return vec.reduce(function (acc,item){
                return acc.concat(item);
            },[]);
        },

        chunkArray: function (array, chunkSize) {

            if (!chunkSize) {
                return [];
            }

            if (!Array.isArray(array)){
                return array;
            }

            var a = [], i,j;
            for(i=0, j=0; j < array.length; i++, j=i*chunkSize) {
                a.push(array.slice(j,j+chunkSize));
            }
            return a;
        }
    };

    //monkey patch in the  chunk and the flatten
    Array.prototype.chunk = function (chunkSize) {
        return module.exports.chunkArray(this, chunkSize);
    };

    Array.prototype.flatten = function () {
        return module.exports.flatten(this);
    };

})();