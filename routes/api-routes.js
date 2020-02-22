// var Show = require("../models/shows");
const db = require("../models");
require("dotenv").config();
const passport = require("../config/passport");
const axios = require("axios");
// use process.env.API_KEY when needing to use the api key anywhere else?

module.exports = function (app) {
	//app.get for bringing in most popular movies for index.html carousel
	app.get("/", function (req, res) {
		axios
			.get(
				"https://api.themoviedb.org/3/movie/top_rated?api_key=" +
				process.env.API_KEY +
				"&language=en-US&page=1&region=US"
			)
			.then(function (data) {
				res.json(data);
			})
			.catch(function (e) {
				res.json(e);
			});
	});

	//app.get for bringing in most popular shows for index.html carousel
	app.get("/", function (req, res) {
		axios
			.get(
				"https://api.themoviedb.org/3/tv/on_the_air?api_key=" +
				process.env.API_KEY +
				"&language=en-US&page=1"
			)
			.then(function (data) {
				res.json(data);
			})
			.catch(function (e) {
				res.json(e);
			});
	});

	//app.get for bringing in individual user's to watch for carousel
	app.get("/api/profile/:id", function (req, res) {
		// Here we add an "include" property to our options in our findOne query
		// We set the value to an array of the models we want to include in a left outer join
		db.Show.findOne({
			where: {
				id: req.params.id
			},
			include: [db.User]
		}).then(function (result) {
			res.json(result);
		});
	});

	// app.post for login
	app.post("/api/login", passport.authenticate("local"), function (req, res) {
		res.json(req.user);
	});

	// app.post for signup
	app.post("/api/signup", function (req, res) {
		db.User.create({
			email: req.body.email,
			password: req.body.password
		})
			.then(function () {
				res.redirect(307, "/api/login");
			})
			.catch(function (err) {
				res.status(401).json(err);
			});
	});

	// app.get for logout
	app.get("/logout", function (req, res) {
		req.logout();
		res.redirect("/");
	});

	// app.get for user_data (DO WE NEED THIS ONE?)
	app.get("/api/user_data", function (req, res) {
		if (!req.user) {
			res.json({});
		} else {
			res.json({
				email: req.user.email,
				id: req.user.id
			});
		}
	});

	// app.get for getting info from our database for user watchlist
	// join with user and shows where user_id in shows equals user id and also where want_to_watch is true
	app.get("/api/user/:id", function (req, res) {
		db.Show.findAll({
			where: {
				id: req.body.id
			}
		});
	});

	// app.get info from movie db for specific title info
	app.get("/api/search/:title", function (req, res) {
		axios
			.get(
				"https://api.themoviedb.org/3/search/multi?api_key=" +
				process.env.API_KEY +
				"&language=en-US&query=" +
				title +
				"&page=1&include_adult=false"
			)
			.then(function (data) {
				res.json(data);
			})
			.catch(function (e) {
				res.json(e);
			});
	});

	// app.post for search (the example that lindsay showed)
	app.post("/api/search", function (req, res) {
		// const title = req.params.title;
		axios
			.get(
				"https://api.themoviedb.org/3/search/multi?api_key=" +
				process.env.API_KEY +
				"&language=en-US&query=" +
				title +
				"&page=1&include_adult=false",
				{
					params: {
						title: req.body.title
					}
				}
			)
			.then(function (data) {
				res.json(data);
			})
			.catch(function (e) {
				res.json(e);
			});
	});

	// app.post for watchlist, needs booleans passed into it inside the post for want to watch true watching false completed false etc.

	// app.put for switching a title to watching

	// app.put for switching a title to completed

	// app.delete for removing from list completely

	// below is what was already in this file before we added all the necessary routes above...

	//app.get for bringing in individual user's watchlist for carousel
	app.get("/api/users/:id", function (req, res) {
		db.User.findOne({
			// where: {
			//   id: //how are we grabbing this from the currently logged in data?
			// },
			include: [db.Show]
		}).then(data => {
			//am I understanding correctly that this would be the information pulled
			// from the database and allow me to pull their movie titles etc?
			res.json(data);
		});
	});

	//app.get for bringing in individual user's have watched for carousel

	//app.get for bringing in individual user's want to watch for carousel

	//app.post for adding new movie or tv show

	// app.get for browse shows FUTURE DEVELOPMENT

	// app.get for browse movies FUTURE DEVELOPMENT
};
