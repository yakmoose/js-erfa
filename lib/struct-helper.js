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
        }
    }
})();