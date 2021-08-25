const production = (process.env.NODE_ENV == "production");

/* default options */
export const defaultOptions = {
    target: "es2015",
    publicPath: "/",
    dest: "dist",
    port: 3000,
    minify: production ? true : false,
    open: production ? false : true,
    legacy: false,
    paths: undefined,
    external: undefined
};