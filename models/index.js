var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
	logging: false
});

//var connection = new Sequelize('root', null, null, {dialect: postgres});


var Page = db.define('page', {
    title: {
        type: Sequelize.STRING, 
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false, 
    },
    content: {
        type: Sequelize.TEXT, 
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    }, 
    date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    getterMethods: {
		route: function() {return ("/wiki/" + this.urlTitle)}
    }
});   


Page.hook('beforeValidate', function (page) {
    if (page.title) {
        // Removes all non-alphanumeric characters from title
        // And make whitespace underscore
        page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
        console.log('page url: ' + page.urlTitle);
    } else {
        // Generates random 5 letter string
        page.urlTitle = Math.random().toString(36).substring(2, 7);
    }
});



var User = db.define('user', {
    name: {
        type: Sequelize.STRING, 
        is: /^[a-z]+$/i, 
        allowNull: false
    },
    email: {
        type: Sequelize.STRING, 
        isEmail: true, 
        allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });


module.exports = {
  Page: Page,
  User: User
};