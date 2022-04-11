const config = {
    keycloak: {
        url: "https://" + process.env.PUBLIC_URI + "/auth",
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PWD,
        realm: process.env.NAMESPACE,
    },
    db: {
        url: "http://hasura."+process.env.NAMESPACE+"/v1/graphql",
    },
    minio: {
        url: "minio."+process.env.NAMESPACE,
        app: process.env.APP_URI,
        accessKey: process.env.MINIO_ACCESS,
        secretKey: process.env.MINIO_SECRET
    }
};

export default config;