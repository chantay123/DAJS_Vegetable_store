function removeVietnameseTones(str) {
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D");
    }

module.exports = {
    generateSlug: function (name) {
        try {
            name = removeVietnameseTones(name);
            let slug = name.toLowerCase().replace(/ /g, '-');
            return slug;
        } catch (error) {
            throw new Error(error.message)
        }
    },
}