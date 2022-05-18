export const removeSymbolsOnString = (string: string): string => {
    return string.replaceAll(/[^0-9a-zA-ZçãáàãõóéíúÇÃÁÀÃÕÓÉÍÚ@\x2D. ]+/g, "") || ""
}