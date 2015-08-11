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
    
    ListManager.CurrentList;
    
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
    
    /** VIEWS **/
    
    ListManager.ListView = Marionette.ItemView.extend({
        template: '#list-template',
        onRender: function() {
            this.stickit();
        },
        bindings: {
            '.name': 'name',
        },
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
            this.model.fetch();
        }
    });
    
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
            ListManager.CurrentList = this.model;
            var currentListView = new ListManager.ListView({
                model: ListManager.CurrentList,
            });
            ListManager.regions.currentList.show(currentListView);
            ListManager.allListsView.render();
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
    
    /** START **/
    
    ListManager.on('before:start', function() {
        var RegionContainer = Marionette.LayoutView.extend({
            el: '#app-region',
            regions: {
                allLists: '#all-lists-region',
                currentList: '#current-list-region'
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
                ListManager.CurrentList = ListManager.AllLists.models[0];
                var currentListView = new ListManager.ListView({
                    model: ListManager.CurrentList,
                });
                ListManager.regions.currentList.show(currentListView);
                ListManager.allListsView.render();
            }
        });
        
        ListManager.regions.allLists.show(ListManager.allListsView);
        
    });

    ListManager.start();
});
