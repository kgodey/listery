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
    
    ListManager.List =  Backbone.NestedModel.extend({
        urlRoot: '/api/lists/',
    });
    
    ListManager.ListItem =  Backbone.NestedModel.extend({
        url: '/api/listitems/',
    });
    
    ListManager.ListCollection = Backbone.Collection.extend({
        model: ListManager.List,
        url: '/api/lists/'
    });
    
    ListManager.ListItemCollection = Backbone.Collection.extend({
        model: ListManager.ListItem,
        url: '/api/listitems/'
    });
    
    /** VIEWS **/
        
    ListManager.ListNameView = Marionette.ItemView.extend({
        tagName: 'li',
        className: function() {
            if (this.model == ListManager.CurrentList) {
                return 'list-group-item list-group-item-success';
            }
            return 'list-group-item';
        },        
        template: '#list-name-template',
        onRender: function() {
            this.stickit();
        },
        bindings: {
            '.name': 'name',
        },
        events: {
            'click .switch-list': 'switchList',
        },
        switchList: function() {
            ListManager.setCurrentList(this.model);
        }
    });
    
    ListManager.AllListsView = Marionette.CompositeView.extend({
        template: '#all-lists-template',
        childView: ListManager.ListNameView,
        childViewContainer: 'ul',
        events: {
            'click .add-list-button': 'createNewList',
        },
        initialize: function() {
            this.listenTo(this.collection, "change", this.render);
        },
        createNewList: function() {
            var newList = new ListManager.List({
                name: this.$('#new-list-name').val(),
            });
            newList.save();
            this.collection.fetch();
        },
    });
    
    ListManager.ListItemView = Marionette.ItemView.extend({
        template: '#list-item-template',
        tagName: 'li',
        className: 'list-group-item',
    });
    
    ListManager.ListItemsView = Marionette.CollectionView.extend({
        childView: ListManager.ListItemView,
        tagName: 'ul',
        className: 'list-group',
    });
    
    ListManager.ListView = Marionette.ItemView.extend({
        template: '#list-template',
        initialize: function() {
            this.listenTo(this.model, "change", this.render);
        },
        events: {
            'click .add-button': 'createNewItem',
        },
        createNewItem: function() {
            var listItem = new ListManager.ListItem({
                description: this.$('.new-description').val(),
                list: this.model.get('id')
            });
            listItem.save();
            this.model.fetch({
                success: function(model) {
                    ListManager.setCurrentList(model);
                }
            });
        }
    });
    
    /** SET CURRENT LIST **/
    
    ListManager.setCurrentList = function(list) {
        ListManager.CurrentList = list;
        ListManager.CurrentListItems = new ListManager.ListItemCollection();
        ListManager.CurrentListItems.set(ListManager.CurrentList.get('items'));
        
        var currentListView = new ListManager.ListView({
            model: ListManager.CurrentList,
        });
        var currentListItemsView = new ListManager.ListItemsView({
            collection: ListManager.CurrentListItems,
        });
        
        ListManager.regions.currentList.show(currentListView);
        ListManager.regions.currentListItems.show(currentListItemsView);
        ListManager.allListsView.render();
    }
    
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
        
        ListManager.allListsView = new ListManager.AllListsView({
            collection: ListManager.AllLists,
        });
        
        ListManager.AllLists.fetch({
            success: function() {
                ListManager.setCurrentList(ListManager.AllLists.models[0]);
            }
        });
        
        ListManager.regions.allLists.show(ListManager.allListsView);
        
    });

    ListManager.start();
});
