const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./schema/schema");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

mongoose.connect("mongodb+srv://test123:test123@cluster0.vu0n3.mongodb.net/<dbname>?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.once("open", function()
{
	console.log("Connected!");
});

app.use(cors());

app.use("/graph", graphqlHTTP
({
	schema: schema,
	// graphiql: true
}));

app.listen(4000, function()
{
	console.log("Listening on port 4000!!!");
});