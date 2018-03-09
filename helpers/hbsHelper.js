const _ = require('lodash');

module.exports = {
    isFirstPage: (page) => {
        if(page === 1)
            return true;
        return false;
    },
    add: (base, number) => {
        return base + number;
    },
    isLastPage: (total, page, pagination) => {
        if(total <= page*pagination)
            return true;
        return false;
    },
    hasRescue: (rescue) => {
        if(rescue !== undefined && rescue.deleted === false)
            return true;
        return false;
    }
};