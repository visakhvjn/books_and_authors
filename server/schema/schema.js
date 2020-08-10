const graphql = require("graphql");
const _ = require("lodash");

const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull } = graphql;
const Book = require("../models/book");
const Author = require("../models/author");

// const books =
// [
// 	{"name": "First Book", "id": "1", "authorId": "1"},
// 	{"name": "Second Book", "id": "2", "authorId": "2"},
// 	{"name": "Third Book", "id": "3", "authorId": "3"},
// 	{"name": "Fourth Book", "id": "3", "authorId": "3"},
// 	{"name": "Fifth Book", "id": "3", "authorId": "3"}
// ];

// const authors =
// [
// 	{ "name": "Robin", "age": 22, "id":"1" },
// 	{ "name": "Moinak", "age": 25, "id":"2" },
// 	{ "name": "Ravana", "age": 42, "id":"3" },
// ];

// Declaring a type/node in the graph schema.
const BookType = new GraphQLObjectType
({
	name: "Book",
	fields: () =>
	({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		genre: {type: GraphQLString},
		author:
		{
			type: AuthorType,
			resolve(parent, args)
			{
				// return(_.find(authors, {id: parent.authorId}));
				return(Author.find({_id: parent.authorId}));
			}
		}
	})
});

const AuthorType = new GraphQLObjectType
({
	name: "Author",
	fields: () =>
	({
		id: {type: GraphQLID},
		name: {type: GraphQLString},
		age: {type: GraphQLInt},
		books:
		{
			type: GraphQLList(BookType),
			resolve(parent, args)
			{
				// return(_.filter(books, {authorId: parent.id}));
				return(Book.find({authorId: parent.authorId}));
			}
		}
	})
});

const Mutation = new GraphQLObjectType
({
	name: "Mutation",
	fields:
	{
		addAuthor:
		{
			type: AuthorType,
			args:
			{
				name: {type: GraphQLNonNull(GraphQLString)},
				age: {type: GraphQLInt}
			},
			resolve(parent, args)
			{
				let author = new Author({name: args.name, age: args.age});
				return(author.save());
			}
		},
		addBook:
		{
			type: BookType,
			args:
			{
				name: {type: GraphQLString},
				genre: {type: GraphQLString},
				authorId: {type: GraphQLString},
			},
			resolve(parent, args)
			{
				let book = new Book({name: args.name, genre: args.genre, authorId: args.authorId});
				return(book.save());
			}
		}
	}
})

// Declaring a root query for communication.
const RootQuery = new GraphQLObjectType
({
	name: "RootQuery",
	fields:
	{
		book:
		{
			type: BookType,
			args:
			{
				id: {type: GraphQLID} // book(id)
			},
			resolve(parent, args)
			{
				// The code for this query.
				// args.id is available here.
				// return _.find(books, {id: args.id});

				return(Book.find({_id: args.id}));
			}
		},
		books:
		{
			type: GraphQLList(BookType),
			resolve(parent, args)
			{
				// return(books);
				console.log("Hitting this");

				return(Book.find());
			}
		},
		author:
		{
			type: AuthorType,
			args:
			{
				id: {type: GraphQLID}
			},
			resolve(parent, args)
			{
				// return _.find(authors, {id: args.id});

				return(Author.find({_id: args.id}));
			}
		},
		authors:
		{
			type: GraphQLList(AuthorType),
			resolve(parent, args)
			{
				// return(authors);

				return(Author.find());
			}
		},
	}
});

module.exports = new GraphQLSchema
({
	query: RootQuery,
	mutation: Mutation
});