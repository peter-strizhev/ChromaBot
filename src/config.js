module.exports =
    process.env.NODE_ENV == "prod"
        ? require("./config.json")
        : require("./dev.config.json");
