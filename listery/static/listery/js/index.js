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
		url: '/api/v1/lists/',
		comparator: function(model) {
			return model.get('order');
		}
	});
	
	ListManager.ListItemCollection = Backbone.Collection.extend({
		model: ListManager.ListItem,
		url: '/api/v1/listitems/',
		comparator: function(model) {
			return model.get('order');
		}
	});
	
	ListManager.UserCollection = Backbone.Collection.extend({
		model: ListManager.User,
		url: '/api/v1/users/'
	});
	
	/** ROUTERS **/
	
	ListManager.BaseRouter = Marionette.AppRouter.extend({
		appRoutes: {
			'list/:id': 'openList',
		}
	});
	
	var routerController = {
		openList: function(id) {
			var list = ListManager.AllLists.get(id);
			ListManager.setCurrentList(list);
		}
	}
	
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
		toggleHover: function(event) {
			if ($(event.target).hasClass('nohover')) {
				$(event.target).removeClass('nohover');
			} else {
				this.toggleHidden(this.options.hoverClass);
			}
		},
		toggleHidden: function(className) {
			this.$(className).toggleClass('hidden');
		}
	});
	
	ListManager.Behaviors.ReorderBehavior = Marionette.Behavior.extend({
		defaults: {
			parentView: function() { return ListManager.AllListsView },
			fetchItem: function() { return ListManager.AllLists }
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
			}).done(function() {
				self.options.fetchItem().fetch({
					silent: true
				});
			}).fail(function() {
				self.view.model.errorState = true;
				self.view.model.errorMessage = 'This item could not be reordered at this time. We\'ve restored it to its previous position. Please refresh the page and try again.';
				self.options.parentView().render();
			});
		}
	});
	
	ListManager.Behaviors.ErrorPopoverBehavior = Marionette.Behavior.extend({
		defaults: {
			element: function(view) { return view.$el; },
			model: function(view) { return view.model; }
		},
		events: {
			'handle-potential-error': 'handlePotentialError'
		},
		handlePotentialError: function() {
			var model = this.options.model(this.view);
			if (model && model.errorState) {
				var element = this.options.element(this.view);
				var idName = 'dismiss-popover-' + model.get('id');
				element.popover({
					title: '<span class="glyphicon glyphicon-exclamation-sign pull-left"></span>Error<span class="glyphicon glyphicon-exclamation-sign pull-right"></span>',
					html: true,
					content: '<p>' + model.errorMessage + '</p><button id="' + idName + '" class="btn btn-danger pull-right">OK</button>',
					placement: 'auto left'
				});
				model.errorState = model.constructor.prototype.errorState;
				model.errorMessage = model.constructor.prototype.errorMessage;
				model.errorAttribute = model.constructor.prototype.errorAttribute;
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
		template: '#list-name-template',
		events: {
			'click': 'switchList',
			'click .archive-item': 'archiveItem',
			'click .download-item': 'downloadItem'
		},
		behaviors: {
			HoverBehavior: {},
			ReorderBehavior: {},
			ErrorPopoverBehavior: {
				element: function(view) {
					return view.$el;
				}
			}
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
							error: function(model, response, options) {
								self.model.errorState = true;
								self.model.errorMessage = 'Sorry, we could not move the selected item into this list, so we\'ve restored its previous position. Please try again and refresh the page if this continues to be an issue.';
								self.$el.trigger('handle-potential-error');
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
				var self = this;
				this.model.fetch({
					error: function(model, response, options) {
						self.model.errorState = true;
						self.model.errorMessage = 'Sorry, there was an error switching to this list. Please try again and refresh the page if this continues to be an issue.';
						self.$el.trigger('handle-potential-error');
					},
					success: function(model, response, options) {
						ListManager.setCurrentList(self.model);
						ListManager.AllListsView.render();
					}
				});
			}
		},
		toggleHidden: function(className) {
			this.$(className).toggleClass('hidden');
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
				self.model.save({archived: true}, {
					patch: true,
					wait: true,
					success: function() {
						ListManager.AllLists.remove(self.model.get('id'));
						if (ListManager.CurrentList === self.model) {
							ListManager.setCurrentList(ListManager.AllLists.models[0]);
							ListManager.AllListsView.render();
						}
					},
					error: function(model, response, options) {
						self.model.errorState = true;
						self.model.errorMessage = 'Sorry, the list could not be archived, so we\'ve restored it to its previous state. Please try again and refresh the page if this continues to be an issue.';
						self.render();
						self.$el.trigger('handle-potential-error');
					},
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
		childView: ListManager.ListSelectorView,
		childViewContainer: 'div',
		events: {
			'keyup #new-list-name': 'processKeyUp',
		},
		behaviors: {
			ErrorPopoverBehavior: {
				element: function(view) {
					return view.$('#new-list-name');
				},
				model: function(view) {
					return ListManager.NewList;
				}
			}
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
					$(ui.item).addClass('nohover');
				}
			});
		},
		createNewList: function() {
			var inputElement = this.$('#new-list-name');
			if (inputElement.val()) {
				var self = this;
				inputElement.prop('disabled', true);
				ListManager.NewList = new ListManager.List({
					name: inputElement.val(),
				});
				ListManager.NewList.save({}, {
					success: function() {
						self.collection.add(ListManager.NewList, {at: 0});
						ListManager.setCurrentList(ListManager.NewList);
						inputElement.val("");
					},
					error: function() {
						ListManager.NewList.errorState = true;
						ListManager.NewList.errorMessage = 'Sorry, we could not save this list to the server. Please try again and refresh the page if this continues to be an issue.';
						self.$el.trigger('handle-potential-error');
					},
					complete: function() {
						inputElement.prop('disabled', false);
					}
				});
			} else {
				inputElement.tooltip({
					placement: 'top',
					title: 'List names cannot be blank!'
				});
				inputElement.tooltip('show');
				this.tooltipShown = true;
				setTimeout(function() {
					inputElement.tooltip('destroy');
				}, 60000);
			}
		},
		processKeyUp: function(event) {
			if (event.keyCode === 13) {
				this.createNewList();
			} else if (event.keyCode === 27) {
				$('#new-list-name').val("");
				$('#new-list-name').blur();
			} else {
				if (this.tooltipShown) {
					this.$('#new-list-name').tooltip('destroy');
					this.tooltipShown = false;
				}
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
			'dblclick': 'editTitleAndDescription',
			'click .toggle-complete': 'toggleComplete',
			'focusout .title-input': 'saveTitleAndDescription',
			'focusout .description-input': 'saveTitleAndDescription',
			'reorder': 'processReorder',
			'keyup .title-input': function(event) {
				if (event.keyCode === 13) {
					this.saveTitleAndDescription(true);
				} else if (event.keyCode === 27) {
					this.render();
				} else {
					if (this.tooltipShown) {
						this.$el.tooltip('destroy');
						this.tooltipShown = false;
					}
				}
			},
			'keyup .description-input': function(event) {
				if (event.keyCode === 13) {
					this.saveTitleAndDescription(true);
				} else if (event.keyCode === 27) {
					this.render();
				}
			}
		},
		behaviors: {
			HoverBehavior: {},
			ReorderBehavior: {
				parentView: function() { return ListManager.CurrentListItemsView },
				fetchItem: function() { return ListManager.CurrentList }
			},
			ErrorPopoverBehavior: {
				element: function(view) {
					return view.$el;
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
				var currentScrollX = window.scrollX;
				var currentScrollY = window.scrollY;
				self.model.destroy({
					wait: true,
					error: function() {
						self.model.errorState = true;
						self.model.errorMessage = 'Sorry, we could not delete this item on the server, so we\'ve restored it to its previous position. Please try again and refresh the page if this continues to be an issue.';
						self.render();
						self.$el.trigger('handle-potential-error');
					},
					success: function() {
						window.scrollTo(currentScrollX, currentScrollY);
					}
				});
			});
		},
		toggleHidden: function(className) {
			this.$(className).toggleClass('hidden');
		},
		editTitleAndDescription: function(event) {
			var titleInputElement = this.$('.title-input');
			var descriptionInputElement = this.$('.description-input');
			if (!titleInputElement.is(':visible')) {
				this.toggleHidden('.toggle-on-title-description-edit');
				if ($(event.target).hasClass('description')) {
					descriptionInputElement.focus();
				} else {
					titleInputElement.focus();
				}
				descriptionInputElement.val(this.model.get('description'));
				titleInputElement.val(this.model.get('title'));
			}
		},
		saveTitleAndDescription: function(isEnter) {
			var titleInputElement = this.$('.title-input');
			var descriptionInputElement = this.$('.description-input');
			var self = this;
			setTimeout(function() {
				if ((!titleInputElement.is(':focus') && !descriptionInputElement.is(':focus')) || isEnter === true) {
					if (!titleInputElement.val()) {
						self.$el.tooltip({
							placement: 'top',
							title: 'List items cannot be blank!'
						});
						self.$el.tooltip('show');
						self.tooltipShown = true;
					} else {
						var attrsToSave = {};
						if (titleInputElement.val() != self.model.get('title')) {
							attrsToSave.title = titleInputElement.val()
						}
						if (descriptionInputElement.val() != self.model.get('description')) {
							attrsToSave.description = descriptionInputElement.val()
						}
						if (Object.keys(attrsToSave).length) {
							self.saveAttributes(attrsToSave);
						} else {
							self.toggleHidden('.toggle-on-title-description-edit');
						}
					}
				}
			}, 0);
		},
		saveAttributes: function(attributes) {
			var self = this;
			var currentScrollX = window.scrollX;
			var currentScrollY = window.scrollY;
			this.toggleHidden('.toggle-on-save');
			this.model.save(attributes, {
				patch: true,
				wait: true,
				error: function(model, response, options) {
					self.model.errorState = true;
					if ('title' in attributes) {
						self.model.errorMessage = 'Sorry, the updated title could not be saved to the server, so we\'ve restored the previous one. Please try again and refresh the page if this continues to be an issue.';
					} else if ('description' in attributes) {
						self.model.errorMessage = 'Sorry, the updated description could not be saved to the server, so we\'ve restored the previous one. Please try again and refresh the page if this continues to be an issue.';
					} else if ('completed' in attributes) {
						self.model.errorMessage = 'Sorry, the updated completion status could not be saved to the server, so we\'ve restored the previous one. Please try again and refresh the page if this continues to be an issue.';
					}
					self.render();
					self.$el.trigger('handle-potential-error');
				},
				success: function() {
					window.scrollTo(currentScrollX, currentScrollY);
				}
			});
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
		behaviors: {
			ErrorPopoverBehavior: {
				element: function(view) {
					return view.$('.new-title');
				},
				model: function(view) {
					return ListManager.NewListItem;
				}
			}
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
				},
				start: function(event, ui) {
					$(ui.item).addClass('nohover');
				}
			});
		},
		createNewItem: function() {
			var inputElement = this.$('.new-title');
			if (inputElement.val()) {
				var self = this;
				inputElement.prop('disabled', true);
				ListManager.NewListItem = new ListManager.ListItem({
					title: inputElement.val(),
					list: ListManager.CurrentList.get('id'),
				});
				ListManager.NewListItem.save({}, {
					success: function() {
						self.collection.add(ListManager.NewListItem, {at: 0});
						inputElement.val("");
					},
					error: function() {
						ListManager.NewListItem.errorState = true;
						ListManager.NewListItem.errorMessage = 'Sorry, we could not save this item to the server. Please try again and refresh the page if this continues to be an issue.';
						self.$el.trigger('handle-potential-error');
					},
					complete: function() {
						inputElement.prop('disabled', false);
					}
				});
			} else {
				inputElement.tooltip({
					placement: 'top',
					title: 'List items cannot be blank!'
				});
				inputElement.tooltip('show');
				this.tooltipShown = true;
				setTimeout(function() {
					inputElement.tooltip('destroy');
				}, 60000);
			}
		},
		processKeyUp: function(event) {
			if (event.keyCode === 13) {
				this.createNewItem();
			} else if (event.keyCode === 27) {
				$('.new-title').val("");
				$('.new-title').blur();
			} else {
				if (this.tooltipShown) {
					this.$('.new-title').tooltip('destroy');
					this.tooltipShown = false;
				}
			}
		},
		updateItems: function() {
			ListManager.CurrentListItems.set(ListManager.CurrentList.get('items'));
		}
	});
	
	ListManager.ListHeaderView = Marionette.ItemView.extend({
		template: '#list-header-template',
		events: {
			'click .toggle-private': 'togglePrivate',
			'dblclick .edit-name': 'editName',
			'focusout .name-input': 'saveName',
			'keyup .name-input': function(event) {
				if (event.keyCode === 13) {
					this.saveName();
				} else if (event.keyCode === 27) {
					this.render();
				} else {
					this.$('.name-input').tooltip('destroy');
					this.tooltipShown = false;
				}
			},
		},
		behaviors: {
			ErrorPopoverBehavior: {
				element: function(view) {
					if (view.model.errorAttribute === 'private') {
						return view.$('.toggle-private');
					} else {
						return view.$el;
					}
				}
			}
		},
		initialize: function() {
			this.listenTo(this.model, "change", this.setCurrentList);
		},
		togglePrivate: function() {
			var inputElement = this.$('toggle-private');
			inputElement.prop('disabled', true);
			this.saveAttributes({private: !this.model.get('private')});
		},
		saveAttributes: function(attributes) {
			var self = this;
			this.toggleHidden('.toggle-on-save');
			this.model.save(attributes, {
				patch: true,
				wait: true,
				error: function(model, response, options) {
					self.model.errorState = true;
					if ('name' in attributes) {
						self.model.errorMessage = 'Sorry, the changed name could not be saved to the server, so we\'ve restored the previous name. Please try again and refresh the page if this continues to be an issue.';
						self.model.errorAttribute = 'name';
					} else if ('private' in attributes) {
						self.model.errorMessage = 'Sorry, your change in sharing status could not be saved to the server, so we\'ve restored it to the previous state. Please refresh the page if this continues to be an issue.';
						self.model.errorAttribute = 'private';
					}
					self.render();
					self.$el.trigger('handle-potential-error');
				},
				complete: function() {
					var inputElement = self.$('toggle-private');
					inputElement.prop('disabled', false);
				}
			});
		},
		setCurrentList: function() {
			ListManager.setCurrentList(this.model);
			this.render();
		},
		toggleHidden: function(className) {
			this.$(className).toggleClass('hidden');
		},
		editName: function() {
			var inputElement = this.$('.name-input');
			if (!inputElement.is(':visible')) {
				this.toggleHidden('.toggle-on-name-edit');
				inputElement.focus();
				inputElement.val(this.model.get('name'));
			}
		},
		saveName: function() {
			var inputElement = this.$('.name-input');
			if (inputElement.val()) {
				if (inputElement.val() != this.model.get('name')) {
					this.saveAttributes({name: inputElement.val()});
				} else {
					this.toggleHidden('.toggle-on-name-edit');
				}
			} else {
				inputElement.tooltip({
					placement: 'top',
					title: 'List names cannot be blank!'
				});
				inputElement.tooltip('show');
				this.tooltipShown = true;
			}
		}
	});
	
	/** UTILITY FUNCTIONS **/
	
	ListManager.setCurrentList = function(list) {
		if (ListManager.CurrentList != list) {
			var id = list.get('id');
			ListManager.Router.navigate('list/' + id);
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
				var currentURL = Backbone.history.getFragment();
				if (currentURL) {
					var listID = parseInt(currentURL.replace('list/', ''));
					ListManager.setCurrentList(ListManager.AllLists.get(listID));
				} else {
					ListManager.setCurrentList(ListManager.AllLists.models[0]);
				}
			}
		});
		
		ListManager.Users.fetch({});
		
		ListManager.regions.allLists.show(ListManager.AllListsView);
		ListManager.Router = new ListManager.BaseRouter({
			controller: routerController
		});
		if (Backbone.history) {
			Backbone.history.start();
		}
	});

	ListManager.start();
});
