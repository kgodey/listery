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
	
	ListManager.User = Backbone.NestedModel.extend({
		urlRoot: '/api/v1/users/',
	});
	
	ListManager.ListCollection = Backbone.Collection.extend({
		model: ListManager.List,
		url: '/api/v1/lists/'
	});
	
	ListManager.ListItemCollection = Backbone.Collection.extend({
		model: ListManager.ListItem,
		url: '/api/v1/listitems/'
	});
	
	ListManager.UserCollection = Backbone.Collection.extend({
		model: ListManager.User,
		url: '/api/v1/users/'
	});
	
	/** VIEWS **/
		
	ListManager.ListNameView = Marionette.ItemView.extend({
		tagName: 'a',
		className: function() {
			if (this.model == ListManager.CurrentList) {
				return 'list-group-item active droppable sortable-list-name';
			}
			return 'list-group-item droppable sortable-list-name';
		},		  
		template: '#list-name-template',
		events: {
			'click': 'switchList',
			'mouseenter': 'toggleHover',
			'mouseleave': 'toggleHover',
			'reorder': 'processReorder',
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
		onDomRefresh: function() {
			var self = this;
			this.$el.droppable({
				tolerance: 'pointer',
				accept: '.sortable-row',
				hoverClass: 'list-group-item-info',
				drop: function(event, ui) {
					var item = ListManager.CurrentListItems.get($(ui.draggable).attr('id'));
					if (item) {
						var oldList = ListManager.AllLists.get(item.get('list'));
						item.save({list: self.model.get('id')}, {
							patch: true,
							success: function(model, response, options) {
								oldList.fetch();
								self.model.fetch();
							},
						});
					}
				},
			});
		},
		switchList: function(event) {
			if ($(event.target).hasClass('noclick')) {
				$(event.target).removeClass('noclick');
			} else {
				if (!$(event.target).hasClass('edit-name')) {
					ListManager.setCurrentList(this.model);
				}
			}
		},
		toggleHover: function() {
			this.toggleHidden('.hover-options');
		},
		toggleHidden: function(className) {
			this.$(className).toggleClass('hidden');
		},
		editName: function() {
			var inputElement = this.$('.name-input');
			this.toggleHidden('.toggle-on-name-edit');
			inputElement.focus();
			inputElement.val(this.model.get('name'));
		},
		saveName: function() {
			this.saveAttributes({name: this.$('.name-input').val()});
		},
		saveAttributes: function(attributes, success) {
			var self = this;
			if (!success) {
				success = function() {};
			}
			this.model.save(attributes, {
				patch: true,
				error: function(model, response, options) {
					ListManager.parseError(model, response, options);
					self.model.fetch();
				},
				success: success,
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
			function() {
				self.saveAttributes({archived: true}, function() {
					if (ListManager.CurrentList == self.model) {
						ListManager.setCurrentList(ListManager.AllLists.models[0]);
					}
					ListManager.AllLists.remove(self.model.get('id'));
				});
			});
		},
		downloadItem: function(event, model, index) {
			$('#download-form').attr('action', this.model.url() + 'download/');
			$('#download-form').submit();
		},
		processReorder: function(event, index) {
			var self = this;
			$.post(this.model.url() + 'reorder/', {
				order: index,
				csrfmiddlewaretoken: $.cookie('csrftoken'),
			})
				.always(function() {
					ListManager.AllLists.fetch();
			});
		}
	});
	
	ListManager.AllListsView = Marionette.CompositeView.extend({
		template: '#all-lists-template',
		childView: ListManager.ListNameView,
		childViewContainer: 'div',
		events: {
			'keyup #new-list-name': 'processKeyUp',
		},
		initialize: function() {
			this.listenTo(this.collection, "change", this.render);
		},
		createNewList: function() {
			var self = this;
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
				}
			});
		},
		processKeyUp: function(event) {
			if (event.keyCode === 13) {
				this.createNewList();
			}
		},
		onDomRefresh: function() {
			$('.list-sortable').sortable({
				items: 'a.sortable-list-name',
				cursor: 'move',
				update: function(event, ui) {
					ui.item.trigger('reorder', ui.item.index());
				},
				start: function(event, ui) {
					$(ui.item).addClass('noclick');
				}
			});
		}
	});
	
	ListManager.ListItemView = Marionette.ItemView.extend({
		template: '#list-item-template',
		tagName: 'a',
		className: 'list-group-item sortable-row',
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
		},
		attributes: function() {
			return { id: this.model.get('id') }
		},
		list: null,
		events: {
			'click .delete-item': 'deleteItem',
			'mouseenter': 'toggleHover',
			'mouseleave': 'toggleHover',
			'dblclick .edit-title': 'editTitle',
			'dblclick .edit-description': 'editDescription',
			'click .add-description': 'addDescription',
			'click .toggle-complete': 'toggleComplete',
			'focusout .title-input': 'saveTitle',
			'focusout .description-input': 'saveDescription',
			'drop': 'processReorder',
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
		toggleHover: function() {
			this.toggleHidden('.hover-options');
		},
		toggleHidden: function(className) {
			this.$(className).toggleClass('hidden');
		},
		editTitle: function(event) {
			var inputElement = this.$('.title-input');
			this.toggleHidden('.toggle-on-title-edit');
			inputElement.focus();
			inputElement.val(this.model.get('title'));
		},
		editDescription: function(event) {
			var inputElement = this.$('.description-input');
			this.toggleHidden('.toggle-on-description-edit');
			inputElement.focus();
			inputElement.val(this.model.get('description'));
		},
		saveAttributes: function(attributes) {
			var self = this;
			this.model.save(attributes, {
				patch: true,
				error: function(model, response, options) {
					ListManager.parseError(model, response, options);
					if ('description' in attributes) {
						this.toggleHidden('.toggle-on-description-edit');
					} else if ('title' in attributes) {
						this.toggleHidden('.toggle-on-title-edit');
					} else {
						self.model.fetch();
					}
				},
				success: function(model, response, options) {
					var list = ListManager.AllLists.get(self.model.get('list'));
					list.fetch();
				},
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
			this.toggleHidden('.toggle-on-description-edit');
			editSpan.removeClass('glyphicon-plus');
			if (inputElement.is(':visible')) {
				inputElement.focus();
				inputElement.val(this.model.get('description'));
			} else {
				this.model.saveAttributes({description: inputElement.val()});
			}
		},
		toggleComplete: function() {
			this.saveAttributes({completed: !this.model.get('completed')});
		},
		processReorder: function(event, index) {
			if (this.model.get('order') != index) {
				var self = this;
				$.post(this.model.url() + 'reorder/', {
					order: index,
					csrfmiddlewaretoken: $.cookie('csrftoken'),
				})
					.always(function() {
						self.model.fetch();
						var list = ListManager.AllLists.get(self.model.get('list'));
						list.fetch();
				});
			}
		},
	});
	
	ListManager.ListItemsView = Marionette.CompositeView.extend({
		childView: ListManager.ListItemView,
		childViewContainer: 'div',
		template: '#list-items-template',
		events: {
			'keyup .new-title': 'processKeyUp',
		},
		onShow: function() {
			this.$('.new-title').focus();
		},
		list: null,
		createNewItem: function() {
			var self = this;
			this.toggleLoading();
			var listItem = new ListManager.ListItem({
				title: this.$('.new-title').val(),
				list: self.list.get('id'),
			});
			listItem.save({}, {
				success: function() {
					self.list.fetch();
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
	});
	
	ListManager.ListView = Marionette.ItemView.extend({
		template: '#list-template',
		events: {
			'click .toggle-private': 'togglePrivate',
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.setCurrentList);
		},
		setCurrentList: function() {
			ListManager.setCurrentList(this.model);
		},
		togglePrivate: function() {
			var self = this;
			this.model.save({private: !this.model.get('private')}, {
				patch: true,
				error: function(model, response, options) {
					ListManager.parseError(model, response, options);
					self.model.fetch();
				},
			});
		},
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
		ListManager.CurrentListItemsView.list = ListManager.CurrentList;
		
		ListManager.regions.currentListName.show(ListManager.CurrentListView);
		ListManager.regions.currentListItems.show(ListManager.CurrentListItemsView);
		ListManager.AllListsView.render();
		$('.item-sortable').sortable({
			items: 'a.sortable-row',
			cursor: 'move',
			out: function(event, ui) {
				ui.item.trigger('drop', ui.item.index());
				$(ui.item).find('.hover-options').toggleClass('hidden');
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
				currentListItems: '#current-list-items-region',
				currentListName: '#current-list-name-region',
			}
		});
		ListManager.regions = new RegionContainer();
	});
	
	ListManager.on('start', function() {
		ListManager.AllLists = new ListManager.ListCollection();
		ListManager.Users = new ListManager.UserCollection();
		
		ListManager.AllListsView = new ListManager.AllListsView({
			collection: ListManager.AllLists,
		});
		
		ListManager.AllLists.fetch({
			success: function() {
				ListManager.setCurrentList(ListManager.AllLists.models[0]);
			}
		});
		
		ListManager.Users.fetch({});
		
		ListManager.regions.allLists.show(ListManager.AllListsView);
		
	});

	ListManager.start();
});
