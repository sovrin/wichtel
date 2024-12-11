export const formatDate = (date: Date): string => {
    const formatter = new Intl.DateTimeFormat('de-DE');

    return formatter.format(date);
}
