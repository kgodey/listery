/** BACKBONE UTILITIES **/

var _sync = Backbone.sync;
Backbone.sync = function(method, model, options){
	options.beforeSend = function(xhr){
		xhr.setRequestHeader('X-CSRFToken', $.cookie('csrftoken'));
	};
	
	var _error = options.error;
	options.error = function(response) {
		ListManager.parseError(response);
		_error(response);
	}
	
	return _sync(method, model, options);
};

var _url = Backbone.NestedModel.prototype.url;

Backbone.NestedModel.prototype.url = function() {
	var origUrl = _url.call(this);
	return origUrl + (origUrl.charAt(origUrl.length - 1) == '/' ? '' : '/');
}

$(function() {
		
	ListManager = new Marionette.Application();

	ListManager.parseError = function (response) {
		try {
			var data = $.parseJSON(response.responseText);
		} catch (e) {
			var message = 'The server appears to be down. Please try again later.';
		}
		if (data) {
			var errorKey = Object.keys(data)[0];
			var errorMessage = data[errorKey][0];
			if (errorKey == 'non_field_errors') {
				errorKey = 'Error';
			}
			var message = errorKey + ': ' + errorMessage;
		}
		swal({
			title: 'Error',
			text: message,
			type: 'warning',
		});
	};
	
	ListManager.CurrentList, ListManager.CurrentListItems;
	
	/** MODELS & COLLECTIONS **/
	
	ListManager.List =	Backbone.NestedModel.extend({
		urlRoot: '/api/v1/lists/',
		errorState: false,
		errorMessage: 'An unknown error has occured. Please refresh the page.',
		errorAttribute: null
	});
	
	ListManager.ListItem =	Backbone.NestedModel.extend({
		urlRoot: '/api/v1/listitems/',
		errorState: false,
		errorMessage: 'An unknown error has occured. Please refresh the page.',
		errorAttribute: null
	});
	
	ListManager.User = Backbone.NestedModel.extend({
		urlRoot: '/api/v1/users/'
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
	
	/** BEHAVIORS **/
	
    Marionette.Behaviors.behaviorsLookup = function() {
         return ListManager.Behaviors;
    }
	
	ListManager.Behaviors = {};
	
	ListManager.Behaviors.HoverBehavior = Marionette.Behavior.extend({
		defaults: {
			hoverClass: '.hover-options',
		},
		events: {
			'mouseenter': 'toggleHover',
			'mouseleave': 'toggleHover',
		},
		toggleHover: function() {
			this.toggleHidden(this.options.hoverClass);
		},
		toggleHidden: function(className) {
			this.$(className).toggleClass('hidden');
		}
	});
	
	ListManager.Behaviors.ReorderBehavior = Marionette.Behavior.extend({
		defaults: {
			fetchItem: function() { return ListManager.AllLists },
			parentView: function() { return ListManager.AllListsView }
		},
		events: {
			'reorder': 'processReorder'
		},
		onShow: function() {
			this.view.$el.trigger('handle-potential-error');
		},
		processReorder: function(event, index) {
			var self = this;
			$.post(this.view.model.url() + 'reorder/', {
				order: index,
				csrfmiddlewaretoken: $.cookie('csrftoken'),
			}).fail(function() {
				self.view.model.errorState = true;
				self.view.model.errorMessage = 'This item could not be reordered at this time. We\'ve restored it to its previous position. Please refresh the page and try again.';
				self.options.parentView().render();
			}).always(function() {
				self.options.fetchItem().fetch();
			});
		}
	});
	
	ListManager.Behaviors.ErrorPopoverBehavior = Marionette.Behavior.extend({
		defaults: {
			element: function(view) { return view.$el; }
		},
		events: {
			'handle-potential-error': 'handlePotentialError'
		},
		handlePotentialError: function() {
			if (this.view.model.errorState) {
				var element = this.options.element(this.view);
				var idName = 'dismiss-popover-' + this.view.model.get('id');
				element.popover({
					title: 'Error',
					html: true,
					content: '<p>' + this.view.model.errorMessage + '</p><button id="' + idName + '">Got it!</button>',
					placement: 'auto left'
				});
				this.view.model.errorState = this.view.model.constructor.prototype.errorState;
				this.view.model.errorMessage = this.view.model.constructor.prototype.errorMessage;
				this.view.model.errorAttribute = this.view.model.constructor.prototype.errorAttribute;
				element.popover('show');
				$('#' + idName).click(function() {
					element.popover('destroy');
				});
			}
		}
	});
	
	/** VIEWS **/
		
	ListManager.ListSelectorView = Marionette.ItemView.extend({
		tagName: 'a',
		className: function() {
			if (this.model == ListManager.CurrentList) {
				return 'list-group-item active droppable sortable-list-name';
			}
			return 'list-group-item droppable sortable-list-name';
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.updateHeader);
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
				} else if (event.keyCode === 27) {
					this.render();
				}
			},
		},
		behaviors: {
			HoverBehavior: {},
			ReorderBehavior: {},
			ErrorPopoverBehavior: {}
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
					ListManager.AllListsView.render();
				}
			}
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
			if (this.$('.name-input').val()) {
				this.saveAttributes({name: this.$('.name-input').val()});
			}
		},
		saveAttributes: function(attributes, success) {
			var self = this;
			this.model.set(attributes);
			this.model.save(attributes, {
				patch: true,
				error: function(model, response, options) {
					self.model.fetch();
				},
				success: function(model, response, options) {
					if (success) {
						success(model, response, options);
					}
				},
			});
		},
		archiveItem: function() {
			var self = this;
			swal({
				title: "Are you sure?",
				text: "\"" + self.model.get('name') + "\" will be deleted immediately.",
				type: "warning",
				showCancelButton: true,
				confirmButtonText: "Yes, delete it!",
				closeOnConfirm: true
			},
			function() {
				self.saveAttributes({archived: true}, function() {
					if (ListManager.CurrentList === self.model) {
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
		updateHeader: function() {
			if (ListManager.CurrentList == this.model) {
				ListManager.CurrentListHeaderView.model.set(this.model.toJSON());
			}
		}
	});
	
	ListManager.AllListsView = Marionette.CompositeView.extend({
		template: '#all-lists-template',
		childView: ListManager.ListSelectorView,
		childViewContainer: 'div',
		events: {
			'keyup #new-list-name': 'processKeyUp',
		},
		initialize: function() {
			this.listenTo(this.collection, "change", this.render);
			this.listenTo(this.collection, "sync", this.render);
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
		},
		createNewList: function() {
			if (this.$('#new-list-name').val()) {
				var self = this;
				var newList = new ListManager.List({
					name: this.$('#new-list-name').val(),
				});
				newList.save({}, {
					success: function() {
						ListManager.setCurrentList(newList);
						self.collection.add(newList);
						self.render();
					}
				});
			}
		},
		processKeyUp: function(event) {
			if (event.keyCode === 13) {
				this.createNewList();
			} else if (event.keyCode === 27) {
				$('#new-list-name').val("");
				$('#new-list-name').blur();
			}
		}
	});
	
	ListManager.ListItemView = Marionette.ItemView.extend({
		template: '#list-item-template',
		tagName: 'a',
		className: function() {
			if (this.errorState) {
				return 'list-group-item list-group-item-danger sortable-row';
			}
			return 'list-group-item sortable-row';
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.render);
		},
		attributes: function() {
			return { id: this.model.get('id') }
		},
		events: {
			'click .delete-item': 'deleteItem',
			'dblclick .edit-title': 'editTitle',
			'dblclick .edit-description': 'editDescription',
			'click .add-description': 'addDescription',
			'click .toggle-complete': 'toggleComplete',
			'focusout .title-input': 'saveTitle',
			'focusout .description-input': 'saveDescription',
			'reorder': 'processReorder',
			'keyup .title-input': function(event) {
				if (event.keyCode === 13) {
					this.saveTitle();
				} else if (event.keyCode === 27) {
					this.render();
				}
			},
			'keyup .description-input': function(event) {
				if (event.keyCode === 13) {
					this.saveDescription();
				} else if (event.keyCode === 27) {
					this.render();
				}
			}
		},
		behaviors: {
			HoverBehavior: {},
			ReorderBehavior: {
				fetchItem: function() { return ListManager.CurrentList },
				parentView: function() { return ListManager.CurrentListItemsView }
			},
			ErrorPopoverBehavior: {
				element: function(view) {
					if (view.model.errorAttribute === 'title') {
						return view.$('.edit-title');
					} else if (view.model.errorAttribute === 'description') {
						return view.$('.edit-description');
					} else if (view.model.errorAttribute === 'completed') {
						return view.$('.toggle-complete');
					} else {
						return view.$el;
					}
				}
			}
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
			this.toggleHidden('.toggle-on-save');
			this.model.save(attributes, {
				patch: true,
				wait: true,
				success: function(model, response, options) {
					var list = ListManager.AllLists.get(self.model.get('list'));
					list.fetch();
				},
				error: function(model, response, options) {
					self.model.errorState = true;
					self.model.errorMessage = 'Sorry, your changes could not be saved to the server, so we\'ve restored them to their previous state. Please refresh the page if this continues to be an issue.';
					if ('title' in attributes) {
						self.model.errorAttribute = 'title';
					} else if ('description' in attributes) {
						self.model.errorAttribute = 'description';
					} else if ('completed' in attributes) {
						self.model.errorAttribute = 'completed';
					}
					self.render();
					self.$el.trigger('handle-potential-error');
				}
			});
		},
		saveTitle: function() {
			if (this.$('.title-input').val()) {
				this.saveAttributes({title: this.$('.title-input').val()});
			}
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
		}
	});
	
	ListManager.ListItemsView = Marionette.CompositeView.extend({
		childView: ListManager.ListItemView,
		childViewContainer: 'div',
		template: '#list-items-template',
		events: {
			'keyup .new-title': 'processKeyUp',
		},
		initialize: function() {
			this.listenTo(ListManager.CurrentList, "change", this.updateItems);
			this.listenTo(this.collection, "change", this.render);
		},
		onDomRefresh: function() {
			this.$('.new-title').focus();
			$('.item-sortable').sortable({
				items: 'a.sortable-row',
				cursor: 'move',
				update: function(event, ui) {
					ui.item.trigger('reorder', ui.item.index());
				}
			});
		},
		createNewItem: function() {
			if (this.$('.new-title').val()) {
				var listItem = new ListManager.ListItem({
					title: this.$('.new-title').val(),
					list: ListManager.CurrentList.get('id'),
				});
				listItem.save({}, {
					success: function() {
						ListManager.CurrentList.fetch({});
					}
				});
			}
		},
		processKeyUp: function(event) {
			if (event.keyCode === 13) {
				this.createNewItem();
			} else if (event.keyCode === 27) {
				$('.new-title').val("");
				$('.new-title').blur();
			}
		},
		updateItems: function() {
			ListManager.CurrentListItems.set(ListManager.CurrentList.get('items'));
		}
	});
	
	ListManager.ListHeaderView = Marionette.ItemView.extend({
		template: '#list-template',
		events: {
			'click .toggle-private': 'togglePrivate',
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.setCurrentList);
		},
		togglePrivate: function() {
			var self = this;
			this.model.save({private: !this.model.get('private')}, {
				patch: true,
				error: function(model, response, options) {
					self.model.fetch();
				},
			});
		},
		setCurrentList: function() {
			ListManager.setCurrentList(this.model);
			this.render();
		}
	});
	
	/** UTILITY FUNCTIONS **/
	
	ListManager.setCurrentList = function(list) {
		if (ListManager.CurrentList != list) {
			ListManager.CurrentList = list;
			ListManager.CurrentListItems = new ListManager.ListItemCollection();
			ListManager.CurrentListItems.set(ListManager.CurrentList.get('items'));
			
			ListManager.CurrentListHeaderView = new ListManager.ListHeaderView({
				model: ListManager.CurrentList,
			});
			ListManager.CurrentListItemsView = new ListManager.ListItemsView({
				collection: ListManager.CurrentListItems,
			});
			
			ListManager.regions.currentListHeader.show(ListManager.CurrentListHeaderView);
			ListManager.regions.currentListItems.show(ListManager.CurrentListItemsView);
		}
	}
		
	/** START **/
	
	ListManager.on('before:start', function() {
		var RegionContainer = Marionette.LayoutView.extend({
			el: '#app-region',
			regions: {
				allLists: '#all-lists-region',
				currentListItems: '#current-list-items-region',
				currentListHeader: '#current-list-header-region',
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
