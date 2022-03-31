const config = {
    keycloak: {
        url: "https://" + process.env.PUBLIC_URI + "/auth",
        username: process.env.ADMIN_USER,
        password: process.env.ADMIN_PWD,
        realm: process.env.NAMESPACE,
    },
    db: {
        url: "hasura."+process.env.NAMESPACE+"/api/v1/graphql",
    },
    minio: {
        url: "minio."+process.env.NAMESPACE+":9000",
        accessKey: process.env.MINIO_ACCESS,
        secretKey: process.env.MINIO_SECRET
    }
};

export default config;