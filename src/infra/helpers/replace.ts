export type Replace<T, R> = Omit<T, keyof R> & R;

//tipagem generica para validação de campo com exceção