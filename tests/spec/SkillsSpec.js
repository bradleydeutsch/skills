describe('The Skills application', function () {
	var MySkills,
		form,
		input,
		curCount;

	beforeEach(function () {
		loadFixtures('app.html');
		MySkills = new SkillApplication();

		form = $('form#newSkillForm');
		input = form.find('input#newSkill');
		curCount = MySkills.collection.length;
	});

	removeLastAdded = function () {
		$('ul#skills li:last-child a.removeSkill').trigger('click');
	};

	getNewSkillName = function () {
		return 'New Test Skill ' + Math.floor(Math.random() * 9999);
	};

	it('will display the same number of skills on the UI as exist in the collection', function () {
		expect(MySkills.collection.length).toEqual($('ul#skills li').length);
	});

	it('can add and remove a skill', function () {
		input.val(getNewSkillName());
		form.submit();
		expect(MySkills.collection.length).toEqual(curCount + 1);

		removeLastAdded();
		expect(MySkills.collection.length).toEqual(curCount);
	});

	it('cannot add the same skill twice', function () {
		var newSkillName = getNewSkillName();

		input.val(newSkillName);
		form.submit();

		input.val(newSkillName);
		form.submit();
		expect($('h4.error')).toExist();

		removeLastAdded();
		expect(MySkills.collection.length).toEqual(curCount);
	});

	it('will not accept empty values', function () {
		input.val('');
		form.submit();
		expect($('h4.error')).toExist();
	});
});