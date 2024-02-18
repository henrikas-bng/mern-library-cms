import Author from "../models/author";

export const processAuthorSlug = (author: Author): string => {
    const nameChar = author.name.trim().toLowerCase().charAt(0);
    const surnameChar = author.surname.trim().toLowerCase().charAt(0);
    return `${nameChar}-${surnameChar}-${author._id}`;
};

export const getAuthorIdFromSlug = (slug: string|undefined): string|null => {
    if (!slug)
        return null;

    const explodedSlug = slug.split('-');

    if (explodedSlug.length > 2 && explodedSlug[2])
        return explodedSlug[2];

    return null;
};
