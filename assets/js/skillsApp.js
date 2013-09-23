// Model
Skill = Backbone.Model.extend({
	defaults: function () {
		return {
			id: null,
			skill: null,
			rating: 1
		};
	}
});

// Model View
SkillListingView = Backbone.View.extend({
	tagName: 'li',

	events: {
		'click a.removeSkill': 'removeSkill'
	},

	initialize: function () {
		var _this = this;

		_this.model.bind('destroy', _this.remove, _this);
	},

	render: function () {
		var _this = this;

		_this.template = _.template($('#skill-template').html()),
		_this.$el.html(_this.template(_this.model.toJSON()));

		_this.$el.addClass('rating-' + _this.model.get('rating'));

		return _this;
	},

	remove: function (evt) {
		this.$el.remove();
	},

	removeSkill: function (evt) {
		var _this = this;

		evt.preventDefault();

		_this.model.destroy();
	}
});

// Collection
SkillCollection = Backbone.Collection.extend({
	model: Skill,

	localStorage: new Backbone.LocalStorage('skills'),

	initialize: function () {
		var _this = this;
	}
});

// Application View
SkillApplication = Backbone.View.extend({
	events: {
		'submit form#newSkillForm'	: 'addSkill',
		'click a#addSkill'			: 'addSkill'
	},

	initialize: function () {
		var _this = this;

		_this.collection = new SkillCollection(); // Defined here for testing purposes
		_this.setElement($('#skillsContainer')); // Defined here for testing purposes

		_this.listEl = _this.$('ul#skills');
		_this.newSkillForm = _this.$('form#newSkillForm');
		_this.newSkillField = _this.newSkillForm.find('input#newSkill');
		_this.newSkillRatingField = _this.newSkillForm.find('select#newSkillRating');
		_this.skillStatus = _this.$('h3#skillStatus span');

		_this.buildRating();

		_this.collection.bind('add', _this.addOne, _this);
		_this.collection.bind('reset', _this.addAll, _this);
		_this.collection.bind('change add remove', _this.updateStatus, _this);

		_this.collection.fetch();

		$('div#loadingContainer').addClass('hidden');
		$('div#skillsContainer').hide().removeClass('hidden').show('slide', {
			direction: 'up'
		}, 400);
	},

	addOne: function (skill) {
		var _this = this;

		$(new SkillListingView({model: skill}).render().el).appendTo(_this.listEl);
	},

	addAll: function () {
		this.collection.each(this.addOne);
	},

	addSkill: function (evt) {
		var _this = this,
			skill = $('<div />').text(_this.newSkillField.val()).html(),
			alreadyExists;

		evt.preventDefault();
		
		if (skill.length === 0) {
			_this.addError('You can\'t add an empty skill');
		} else if (_this.isUnique(skill)) {
			_this.collection.create({
				skill	: skill,
				rating	: parseInt(_this.newSkillRatingField.val())
			});
			_this.newSkillField.focus();
		} else {
			_this.addError('Skill \'' + skill + '\' already exists')
		}

		_this.newSkillField.val('');
	},

	addError: function (str) {
		var _this = this,
			error = $('<h4 class="error">' + str + '</h4>');

		_this.newSkillForm.after(error);

		setTimeout(function () {
			error.hide('fade', 500, function () {
				$(this).remove();
			});
		}, 2000);
	},

	updateStatus: function () {
		this.skillStatus.first().text(this.collection.length).addBack().last().text(this.collection.where({rating: 4}).length).closest('h3').toggleClass('hidden', this.collection.length === 0);
	},

	isUnique: function (str) {
		var _this = this;

		return (_this.collection.filter(function (skill) {
			return (skill.get('skill').toLowerCase() === str.toLowerCase());
		}).length === 0);
	},

	buildRating: function () {
		var _this = this,
			ratings = getRatings(),
			i;

		for (i = 0; i < ratings.length; i++) {
			_this.newSkillRatingField.append('<option value="' + i + '">' + ratings[i] + '</option>');
		}

		_this.newSkillRatingField.val(Math.floor(ratings.length / 2));
	}
});