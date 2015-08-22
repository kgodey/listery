/** BACKBONE UTILITIES **/

var _sync = Backbone.sync;
Backbone.sync = function(method, model, options){
	options.beforeSend = function(xhr){
		xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
	};
	return _sync(method, model, options);
};

var _url = Backbone.NestedModel.prototype.url;

Backbone.NestedModel.prototype.url = function() {
	var origUrl = _url.call(this);
	return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
}

$(function() {
		
	ListManager = new Marionette.Application();
	
	ListManager.CurrentList, ListManager.CurrentListItems;
	
	/** MODELS & COLLECTIONS **/
	
	ListManager.List =	Backbone.NestedModel.extend({
		urlRoot: '/api/v1/lists/',
	});
	
	ListManager.ListItem =	Backbone.NestedModel.extend({
		urlRoot: '/api/v1/listitems/',
	});
	
	ListManager.ListCollection = Backbone.Collection.extend({
		model: ListManager.List,
		url: '/api/v1/lists/'
	});
	
	ListManager.ListItemCollection = Backbone.Collection.extend({
		model: ListManager.ListItem,
		url: '/api/v1/listitems/'
	});
	
	/** VIEWS **/
		
	ListManager.ListNameView = Marionette.ItemView.extend({
		tagName: 'a',
		className: function() {
			if (this.model == ListManager.CurrentList) {
				return 'list-group-item active';
			}
			return 'list-group-item';
		},		  
		template: '#list-name-template',
		events: {
			'click': 'switchList',
			'click .archive-item': 'archiveItem',
			'click .download-item': 'downloadItem',
			'click .edit-name': 'editName',
			'focusout .name-input': 'saveName',
			'keyup .name-input': function(event) {
				if (event.keyCode === 13) {
					this.saveName();
				}
			},
		},
		switchList: function() {
			ListManager.setCurrentList(this.model);
		},
		editName: function() {
			var inputElement = this.$('.name-input');
			this.$('.toggle-on-name-edit').toggleClass('hidden');
			inputElement.focus();
			inputElement.val(this.model.get('name'));
		},
		saveName: function() {
			var self = this;
			this.model.save({name: this.$('.name-input').val()}, {
				patch: true,
				error: function(model, response, options) {
					ListManager.parseError(model, response, options);
					self.model.fetch();
				}
			});
		},
		archiveItem: function() {
			var self = this;
			swal({
				title: "Are you sure?",
				text: "\"" + self.model.get('name') + "\" will be archived immediately.",
				type: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, archive it!",
				closeOnConfirm: true
			},
			function(){
				self.model.save({archived: true}, {
					patch: true,
					success: function() {
						if (ListManager.CurrentList == self.model) {
							ListManager.setCurrentList(ListManager.AllLists.models[0]);
						}
						ListManager.AllLists.remove(self.model.get('id'));
					},
					error: function(model, response, options) {
						ListManager.parseError(model, response, options);
						self.model.fetch();
					}
				});
			});
		},
		downloadItem: function(event, model, index) {
			$('#download-form').attr('action', this.model.url() + 'download/');
			$('#download-form').submit();
		}
	});
	
	ListManager.AllListsView = Marionette.CompositeView.extend({
		template: '#all-lists-template',
		childView: ListManager.ListNameView,
		childViewContainer: 'div',
		events: {
			'click .add-list-button': 'createNewList',
			'keyup #new-list-name': 'processKeyUp',
		},
		initialize: function() {
			this.listenTo(this.collection, "change", this.render);
		},
		createNewList: function() {
			var self = this;
			this.toggleLoading();
			var newList = new ListManager.List({
				name: this.$('#new-list-name').val(),
			});
			newList.save({}, {
				success: function() {
					ListManager.setCurrentList(newList);
					self.collection.add(newList);
					self.render();
				},
				error: function(model, response, options) {
					ListManager.parseError(model, response, options);
					self.toggleLoading();
				}
			});
		},
		toggleLoading: function() {
			this.$('.toggle-on-add').toggleClass('hidden');
		},
		processKeyUp: function(event) {
			if (event.keyCode === 13) {
				this.createNewList();
			}
		}
	});
	
	ListManager.ListItemView = Marionette.ItemView.extend({
		template: '#list-item-template',
		tagName: 'a',
		className: 'list-group-item',
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
		},
		events: {
			'click .delete-item': 'deleteItem',
			'click .edit-title': 'editTitle',
			'click .edit-description': 'editDescription',
			'click .add-description': 'addDescription',
			'click .toggle-complete': 'toggleComplete',
			'focusout .title-input': 'saveTitle',
			'focusout .description-input': 'saveDescription',
			'drop': 'processDrop',
			'keyup .title-input': function(event) {
				if (event.keyCode === 13) {
					this.saveTitle();
				}
			},
			'keyup .description-input': function(event) {
				if (event.keyCode === 13) {
					this.saveDescription();
				}
			},
			'keyup .toggle-complete': function(event) {
				if (event.keyCode === 13) {
					this.toggleComplete();
				}
			},
		},
		deleteItem: function() {
			var self = this;
			swal({
				title: "Are you sure?",
				text: "\"" + self.model.get('title') + "\" will be deleted immediately.",
				type: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, delete it!",
				closeOnConfirm: true
			},
			function(){
				self.model.destroy();
			});
		},
		toggleEditing: function(className) {
			this.$(className).toggleClass('hidden');
		},
		editTitle: function(event) {
			var target = this.$(event.currentTarget);
			if (target.hasClass('noclick')) {
				target.removeClass('noclick');
			} else {
				var inputElement = this.$('.title-input');
				this.toggleEditing('.toggle-on-title-edit');
				inputElement.focus();
				inputElement.val(this.model.get('title'));
			}
		},
		editDescription: function(event) {
			var target = this.$(event.currentTarget);
			if (target.hasClass('noclick')) {
				target.removeClass('noclick');
			} else {
				var inputElement = this.$('.description-input');
				this.toggleEditing('.toggle-on-description-edit');
				inputElement.focus();
				inputElement.val(this.model.get('description'));
			}
		},
		saveAttributes: function(attributes) {
			var self = this;
			this.model.save(attributes, {
				patch: true,
				error: function(model, response, options) {
					ListManager.parseError(model, response, options);
					if ('description' in attributes) {
						this.toggleEditing('.toggle-on-description-edit');
					} else if ('title' in attributes) {
						this.toggleEditing('.toggle-on-title-edit');
					}
				}
			});
		},
		saveTitle: function() {
			this.saveAttributes({title: this.$('.title-input').val()});
		},
		saveDescription: function() {
			this.saveAttributes({description: this.$('.description-input').val()});
		},
		addDescription: function() {
			var inputElement = this.$('.description-input');
			var editSpan = this.$('.add-description');
			this.toggleEditing('.toggle-on-description-edit');
			editSpan.removeClass('glyphicon-plus');
			editSpan.addClass('glyphicon-floppy-save');
			if (inputElement.is(':visible')) {
				inputElement.focus();
				inputElement.val(this.model.get('description'));
			} else {
				this.model.saveAttributes({description: inputElement.val()});
			}
		},
		toggleComplete: function() {
			var self = this;
			this.model.save({completed: !self.model.get('completed')}, {
				patch: true,
			});
		},
		processDrop: function(event, index) {
			this.$el.trigger('update-sort', [this.model, index]);
		}
	});
	
	ListManager.ListItemsView = Marionette.CollectionView.extend({
		childView: ListManager.ListItemView,
		tagName: 'div',
		className: 'list-group sortable',
		events: {
			'update-sort': 'processSort',
		},
		processSort: function(event, model, index) {
			var id = model.get('id');
			$.post(model.url() + 'reorder/', {
				order: index,
				csrfmiddlewaretoken: $.cookie('csrftoken'),
			});
		}
	});
	
	ListManager.ListView = Marionette.ItemView.extend({
		template: '#list-template',
		initialize: function() {
			this.listenTo(this.model, "change", this.setCurrentList);
		},
		onShow: function() {
			this.$('.new-title').focus();
		},
		events: {
			'click .add-button': 'createNewItem',
			'keyup .new-title': 'processKeyUp',
		},
		createNewItem: function() {
			var self = this;
			this.toggleLoading();
			var listItem = new ListManager.ListItem({
				title: this.$('.new-title').val(),
				list: this.model.get('id')
			});
			listItem.save({}, {
				success: function() {
					self.model.fetch();
				},
				error: function(model, response, options) {
					ListManager.parseError(model, response, options);
					self.toggleLoading();
				}
			});
		},
		processKeyUp: function(event) {
			if (event.keyCode === 13) {
				this.createNewItem();
			}
		},
		toggleLoading: function() {
			this.$('.toggle-on-add').toggleClass('hidden');
		},
		setCurrentList: function() {
			ListManager.setCurrentList(this.model);
		}
	});
	
	/** UTILITY FUNCTIONS **/
	
	ListManager.setCurrentList = function(list) {
		ListManager.CurrentList = list;
		ListManager.CurrentListItems = new ListManager.ListItemCollection();
		ListManager.CurrentListItems.set(ListManager.CurrentList.get('items'));
		
		ListManager.CurrentListView = new ListManager.ListView({
			model: ListManager.CurrentList,
		});
		ListManager.CurrentListItemsView = new ListManager.ListItemsView({
			collection: ListManager.CurrentListItems,
		});
		
		ListManager.regions.currentList.show(ListManager.CurrentListView);
		ListManager.regions.currentListItems.show(ListManager.CurrentListItemsView);
		ListManager.AllListsView.render();
		$('.sortable').sortable({
			update: function(event, ui) {
				ui.item.trigger('drop', ui.item.index());
			},
			start: function(event, ui) {
				$(this).find('.edit-title').addClass('noclick');
				$(this).find('.edit-description').addClass('noclick');
			}
		});
	}
	
	ListManager.parseError = function (model, response, options) {
		var data = $.parseJSON(response.responseText);
		var errorKey = Object.keys(data)[0];
		var errorMessage = data[errorKey][0];
		if (errorKey == 'non_field_errors') {
			errorKey = 'Error';
		}
		var message = errorKey + ': ' + errorMessage;
		swal({
			title: 'Error',
			text: message,
			type: 'warning',
		});
	};
	
	/** START **/
	
	ListManager.on('before:start', function() {
		var RegionContainer = Marionette.LayoutView.extend({
			el: '#app-region',
			regions: {
				allLists: '#all-lists-region',
				currentList: '#current-list-region',
				currentListItems: '#current-list-items-region',
			}
		});
		ListManager.regions = new RegionContainer();
	});
	
	ListManager.on('start', function() {
		ListManager.AllLists = new ListManager.ListCollection();
		
		ListManager.AllListsView = new ListManager.AllListsView({
			collection: ListManager.AllLists,
		});
		
		ListManager.AllLists.fetch({
			success: function() {
				ListManager.setCurrentList(ListManager.AllLists.models[0]);
			}
		});
		
		ListManager.regions.allLists.show(ListManager.AllListsView);
		
	});

	ListManager.start();
});
