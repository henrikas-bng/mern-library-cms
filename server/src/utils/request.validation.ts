export const validateUser = {
    email: (email: string): boolean => {
        const regex = new RegExp('^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$');
        return regex.test(email);
    },

    password: (password: string): boolean => {
        const regex = new RegExp('^[a-zA-Z0-9!@#$%&*?]{8,32}$');
        return regex.test(password);
    },
};

export const validateAuthor = {
    name: (name: string): boolean => {
        const regex = new RegExp('^[a-zA-Z]{2,16}$');
        return regex.test(name);
    },

    surname: (surname: string): boolean => {
        const regex = new RegExp('^[a-zA-Z]{2,32}$');
        return regex.test(surname);
    },
};

export const validateBook = {
    isbn: (isbn: string): boolean => {
        const regex = new RegExp('^[0-9]{10}$');
        return regex.test(isbn);
    },

    title: (title: string): boolean => {
        return (
            title.length > 0
            && title.length <= 128
        );
    },

    description: (description: string): boolean => {
        return (
            description.length > 0
            && description.length <= 500
        );
    },

    pages: (pages: number): boolean => {
        return (
            pages > 0
            && pages <= 9999
        );
    },
};
