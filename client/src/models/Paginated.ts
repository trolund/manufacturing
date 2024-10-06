export type Paginated<T> = {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    numberOfPages: number;
};