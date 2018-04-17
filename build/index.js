process.env.HMR_PORT=0;process.env.HMR_HOSTNAME="localhost";// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({7:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
exports.defaultColumn = function () {
    return {
        width: 400
    };
};
},{}],2:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var view_1 = require("./models/view");
/**
 * APIの呼び出しはコンポーネント側で行い、ActionsではStateへの変更するだけに留めるのがいいのではないかと思っている
 */
var Actions = /** @class */function () {
    function Actions() {
        this.topics = function (topics) {
            return function (state, actions) {
                return {
                    topics: topics
                };
            };
        };
        this.tabName = function (tabName) {
            return function (state, actions) {
                state.view.tabName = tabName;
                return {
                    view: state.view
                };
            };
        };
        this.replyInput = function (replyTo) {
            return function (state, actions) {
                state.view.replyInput = replyTo;
                return {
                    view: state.view
                };
            };
        };
        this.toggleShowThread = function (postId) {
            return function (state, actions) {
                state.view.showThread = postId;
                return {
                    view: state.view
                };
            };
        };
        this.unshiftMessageList = function (messageList) {
            return function (state, actions) {
                var idx;
                var list = state.messageLists.find(function (l, i) {
                    if (l.topic.id === messageList.topic.id) {
                        idx = i;
                        return true;
                    }
                });
                if (list) {
                    state.messageLists.splice(idx, 1);
                    state.messageLists.unshift(list);
                    return {
                        messageLists: state.messageLists
                    };
                } else {
                    state.view.columns[messageList.topic.id] = view_1.defaultColumn();
                    return {
                        messageLists: [messageList].concat(state.messageLists),
                        view: state.view
                    };
                }
            };
        };
        this.messageList = function (messageList) {
            return function (state, actions) {
                var index = Actions.getMessageListIndex(messageList.topic.id, state);
                if (state.messageLists[index]) {
                    // merge posts
                    var oldPosts = state.messageLists[index].posts;
                    var newPosts_1 = messageList.posts;
                    var willAdd_1 = [];
                    oldPosts.forEach(function (oldPost) {
                        if (newPosts_1.find(function (post) {
                            return post.id === oldPost.id;
                        }) === undefined) {
                            willAdd_1.push(oldPost);
                        }
                    });
                    newPosts_1.unshift.apply(newPosts_1, willAdd_1);
                    newPosts_1.sort(function (a, b) {
                        var aDate = new Date(a.createdAt);
                        var bDate = new Date(b.createdAt);
                        if (aDate > bDate) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });
                }
                state.messageLists[index] = messageList;
                return { messageLists: state.messageLists };
            };
        };
        this.post = function (post) {
            return function (state, actions) {
                var messageList = state.messageLists.find(function (ml) {
                    return ml.topic.id === post.topicId;
                });
                if (messageList) {
                    messageList.posts.push(post);
                    actions.messageList(messageList);
                }
            };
        };
        this.updatePost = function (post) {
            return function (state, actions) {
                var ml = state.messageLists.find(function (ml) {
                    return ml.topic.id === post.topicId;
                });
                ml && ml.posts.some(function (p, i) {
                    if (p.id === post.id) {
                        ml.posts[i] = p;
                        return true;
                    }
                });
                actions.messageList(ml);
            };
        };
        this.removeMessageList = function (topicId) {
            return function (state, actions) {
                var idx;
                state.messageLists.some(function (ml, i) {
                    if (ml.topic.id === topicId) {
                        idx = i;
                        return true;
                    }
                });
                if (idx > -1) {
                    state.messageLists.splice(idx, 1);
                    return {
                        messageLists: state.messageLists
                    };
                }
                return {};
            };
        };
        this.selfProfile = function (profile) {
            return function (state, actions) {
                return { selfProfile: profile };
            };
        };
        this.dragstart = function (messageList) {
            return function (state, actions) {
                state.view.draggingMessageList = messageList;
                return {
                    view: state.view
                };
            };
        };
        this.drop = function (messageList) {
            return function (state, actions) {
                if (state.view.draggingMessageList) {
                    var from = state.messageLists.indexOf(state.view.draggingMessageList);
                    var to = state.messageLists.indexOf(messageList);
                    state.messageLists[to] = state.view.draggingMessageList;
                    state.messageLists[from] = messageList;
                    return {
                        messageLists: state.messageLists
                    };
                }
            };
        };
        this.dragend = function () {
            return function (state, actions) {
                state.view.draggingMessageList = null;
                return {
                    view: state.view
                };
            };
        };
    }
    Actions.getMessageListIndex = function (topicId, state) {
        var index = -1;
        state.messageLists.find(function (list, i) {
            if (list.topic.id === topicId) {
                index = i;
                return true;
            }
        });
        return index;
    };
    return Actions;
}();
exports["default"] = Actions;
},{"./models/view":7}],11:[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var electron = __importStar(require("electron"));
var Streaming = /** @class */function () {
    function Streaming() {}
    Streaming.prototype.start = function (callback) {
        electron.ipcRenderer.on("streaming-message", function (event, message) {
            callback(JSON.parse(message));
        });
    };
    return Streaming;
}();
exports["default"] = Streaming;
exports.StreamingEvent = {
    ADD_TALK_POST: "addTalkPost",
    CREATE_TALK: "createTalk",
    DELATE_ATTACHMENT: "deleteAttachment",
    DELETE_MESSAGE: "deleteMessage",
    LIKE_MESSAGE: "likeMessage",
    NOTIFY_MENTION: "notifyMention",
    POST_LINK: "postLinks",
    POST_MESSAGE: "postMessage",
    READ_MENTION: "readMention",
    SAVE_BOOKMARK: "saveBookmark",
    SAVE_LIKES_BOOKMARK: "saveLikesBookmark",
    UNLIKE_MESSAGE: "unlikeMessage",
    UPDATE_MESSAGE: "updateMessage",
    UPDATE_NOTIFICATION_ACCESS: "updateNotificationAccess",
    UPDATE_SPACE: "updateSpace",
    UPDATE_TALK: "updateTalk",
    UPDATE_TOPIC: "updateTopic"
};
},{}],6:[function(require,module,exports) {
"use strict";

var __importStar = this && this.__importStar || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var querystring = __importStar(require("querystring"));
var Streaming_1 = __importDefault(require("./Streaming"));
var secret = querystring.parse(location.search.split("?")[1]);
var CLIENT_ID = secret.client_id;
var CLIENT_SECRET = secret.client_secret;
/**
 * Typetalk api
 */
var TypeTalk = /** @class */function () {
    function TypeTalk() {
        var _this = this;
        this.postMethod = function (url, param) {
            return new Promise(function (res, rej) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    res(JSON.parse(xhr.response));
                };
                xhr.onerror = function () {
                    rej(JSON.parse(xhr.response));
                };
                xhr.open("POST", url);
                if (_this.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _this.token.access_token);
                }
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(param));
                return xhr;
            });
        };
        this.getMethod = function (url, query) {
            if (query === void 0) {
                query = null;
            }
            return new Promise(function (res, rej) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    res(JSON.parse(xhr.response));
                };
                xhr.onerror = function () {
                    rej(JSON.parse(xhr.response));
                };
                xhr.open("GET", url + "?" + querystring.stringify(query));
                if (_this.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _this.token.access_token);
                }
                xhr.send();
                return xhr;
            });
        };
        this.deleteMethod = function (url, param) {
            return new Promise(function (res, rej) {
                var xhr = new XMLHttpRequest();
                xhr.onload = function () {
                    res(JSON.parse(xhr.response));
                };
                xhr.onerror = function () {
                    rej(JSON.parse(xhr.response));
                };
                xhr.open("DELETE", url);
                if (_this.token) {
                    xhr.setRequestHeader("Authorization", "Bearer " + _this.token.access_token);
                }
                xhr.setRequestHeader("Content-Type", "application/json");
                xhr.send(JSON.stringify(param));
                return xhr;
            });
        };
        this.streamingHandlers = new Map();
    }
    TypeTalk.prototype.getToken = function () {
        var _this = this;
        return this.postMethod("https://typetalk.com/oauth2/access_token", {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: "client_credentials",
            scope: "my,topic.read,topic.post"
        }).then(function (token) {
            _this.token = token;
            return token;
        });
    };
    TypeTalk.prototype.getProfile = function () {
        return this.getMethod("https://typetalk.com/api/v1/profile");
    };
    TypeTalk.prototype.getTopics = function () {
        return this.getMethod("https://typetalk.com/api/v1/topics");
    };
    TypeTalk.prototype.getMessageList = function (topicId, fromId) {
        if (fromId === void 0) {
            fromId = null;
        }
        return this.getMethod("https://typetalk.com/api/v1/topics/" + topicId, fromId ? { from: fromId } : null);
    };
    TypeTalk.prototype.getPost = function (topicId, postId) {
        return this.getMethod("https://typetalk.com/api/v1/topics/" + topicId + "/posts/" + postId);
    };
    TypeTalk.prototype.getReplies = function (topicId, postId) {
        return this.getMethod("https://typetalk.com/api/v1/topics/" + topicId + "/posts/" + postId + "/replies");
    };
    TypeTalk.prototype.post = function (topicId, param) {
        return this.postMethod("https://typetalk.com/api/v1/topics/" + topicId, param);
    };
    TypeTalk.prototype.addEventListener = function (evtName, handler) {
        var handlers = this.streamingHandlers.get(evtName);
        if (handlers) {
            handlers.push(handler);
        } else {
            handlers = [handler];
        }
        this.streamingHandlers.set(evtName, handlers);
    };
    TypeTalk.prototype.startStreaming = function () {
        var _this = this;
        this.streaming = new Streaming_1["default"]();
        this.streaming.start(function (msg) {
            var handlers = _this.streamingHandlers.get(msg.type);
            if (handlers) {
                handlers.forEach(function (h) {
                    h(msg);
                });
            }
            // // debug
            // console.log(msg);
            // const data = localStorage.getItem(msg.type);
            // if (!data) {
            //   localStorage.setItem(msg.type, JSON.stringify(msg));
            // }
        });
    };
    TypeTalk.prototype.like = function (topicId, postId) {
        return this.postMethod("https://typetalk.com/api/v1/topics/" + topicId + "/posts/" + postId + "/like", {});
    };
    TypeTalk.prototype.unlike = function (topicId, postId) {
        return this.deleteMethod("https://typetalk.com/api/v1/topics/" + topicId + "/posts/" + postId + "/like", {});
    };
    return TypeTalk;
}();
exports["default"] = TypeTalk;
},{"./Streaming":11}],3:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var Typetalk_1 = __importDefault(require("./typetalk/Typetalk"));
/**
 * Tyoetalkオブジェクトのインスタンス
 */
exports.typetalkApi = new Typetalk_1["default"]();
},{"./typetalk/Typetalk":6}],18:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
exports.node2Array = function (nodeList) {
    var a = [];
    for (var i = 0; i < nodeList.length; i++) {
        a.push(nodeList[i]);
    }
    return a;
};
exports.isAddedToTop = function (addedList, nodeList) {
    var list = exports.node2Array(nodeList);
    return addedList.some(function (node) {
        return list.indexOf(node) === 0;
    });
};
exports.classNames = function (list) {
    var result = "";
    list.forEach(function (cn) {
        result += cn + " ";
    });
    return result;
};
exports.getPost = function (state, topicId, postId) {
    var ml = state.messageLists.find(function (ml) {
        return ml.topic.id === topicId;
    });
    if (ml) {
        return ml.posts.find(function (p, i) {
            return p.id === postId;
        });
    } else {
        return null;
    }
};
},{}],19:[function(require,module,exports) {

},{}],13:[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
var Api_1 = require("../../Api");
require("./Input.css");
exports["default"] = function (_a) {
    var actions = _a.actions,
        topic = _a.topic,
        replyTo = _a.replyTo;
    var localState = {
        message: ""
    };
    var post = function (textarea) {
        return __awaiter(_this, void 0, void 0, function () {
            var param;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        textarea.disabled = true;
                        param = {
                            message: localState.message
                        };
                        if (replyTo) {
                            param.replyTo = replyTo;
                        }
                        return [4 /*yield*/, Api_1.typetalkApi.post(topic.id, param)];
                    case 1:
                        _a.sent();
                        textarea.disabled = false;
                        textarea.value = "";
                        return [2 /*return*/];
                }
            });
        });
    };
    return hyperapp_1.h("div", { "class": "Input", oncreate: function (elm) {
            elm.querySelector("textarea").focus();
        } }, hyperapp_1.h("textarea", { oninput: function (e) {
            localState.message = e.target.value;
        }, onkeydown: function (e) {
            // valueに入力したテキストがちゃんと入ってくるために遅延させる
            setTimeout(function () {
                return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (e.keyCode === 13 && !e.shiftKey) {
                            // Enterキー
                            post(e.target);
                        }
                        return [2 /*return*/];
                    });
                });
            }, 1);
        } }), hyperapp_1.h("button", { type: "button", onclick: function (e) {
            var textarea = e.target.parentElement.querySelector("textarea");
            post(textarea);
        } }, "Post"));
};
},{"../../Api":3,"./Input.css":19}],22:[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
var Api_1 = require("../../Api");
require("./LikeToggle.css");
var utils_1 = require("../../utils/utils");
exports["default"] = function (_a) {
    var state = _a.state,
        post = _a.post,
        actions = _a.actions;
    var isLikedByMe = isProfileIncludes(post.likes, state.selfProfile);
    return hyperapp_1.h("div", { "class": "LikeToggle" }, hyperapp_1.h("button", { type: "button", onclick: function () {
            return __awaiter(_this, void 0, void 0, function () {
                var res, resultPost, res, resultPost;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!isLikedByMe) return [3 /*break*/, 2];
                            return [4 /*yield*/, Api_1.typetalkApi.unlike(post.topicId, post.id)];
                        case 1:
                            res = _a.sent();
                            resultPost = utils_1.getPost(state, res.like.topicId, res.like.postId);
                            setLike(resultPost, res.like, false);
                            actions.updatePost(resultPost);
                            return [3 /*break*/, 4];
                        case 2:
                            return [4 /*yield*/, Api_1.typetalkApi.like(post.topicId, post.id)];
                        case 3:
                            res = _a.sent();
                            resultPost = utils_1.getPost(state, res.like.topicId, res.like.postId);
                            setLike(resultPost, res.like, true);
                            actions.updatePost(resultPost);
                            _a.label = 4;
                        case 4:
                            return [2 /*return*/];
                    }
                });
            });
        } }, isLikedByMe ? "♥" : "♡", " ", post.likes.length));
};
var isProfileIncludes = function (profiles, profile) {
    return profiles.some(function (p) {
        return isMe(p.account, profile.account);
    });
};
var isMe = function (accountA, accountB) {
    return accountA.id === accountB.id;
};
var setLike = function (post, profile, isLike) {
    if (isLike) {
        post.likes.push(profile);
    } else {
        post.likes.some(function (like, i) {
            if (isMe(like.account, profile.account)) {
                post.likes.splice(i, 1);
                return true;
            }
        });
    }
};
},{"../../Api":3,"./LikeToggle.css":19,"../../utils/utils":18}],14:[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
var _this = this;
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
var Api_1 = require("../../Api");
require("./Post.css");
var LikeToggle_1 = __importDefault(require("../atoms/LikeToggle"));
exports["default"] = function (_a) {
    var state = _a.state,
        post = _a.post,
        isObserve = _a.isObserve,
        actions = _a.actions,
        view = _a.view;
    var oncreate = isObserve ? function (elm) {
        var io = new IntersectionObserver(function (entries) {
            return __awaiter(_this, void 0, void 0, function () {
                var messageList;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!entries[0].isIntersecting) return [3 /*break*/, 2];
                            io.disconnect();
                            return [4 /*yield*/, Api_1.typetalkApi.getMessageList(post.topicId, post.id)];
                        case 1:
                            messageList = _a.sent();
                            actions.messageList(messageList);
                            _a.label = 2;
                        case 2:
                            return [2 /*return*/];
                    }
                });
            });
        });
        io.observe(elm);
    } : null;
    var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var newMessage = post.message.replace(urlRegex, function (url) {
        return "<a href=" + url + " target=\"_blank\">" + url + "</a>";
    });
    return hyperapp_1.h("div", { "class": "Post", oncreate: oncreate }, hyperapp_1.h("div", { "class": "Post__thumbnail-container" }, hyperapp_1.h("img", { src: post.account.imageUrl, alt: post.account.fullName })), hyperapp_1.h("button", { type: "button", "class": "Post__post-container", onclick: function () {
            if (view.replyInput === post.id) {
                actions.replyInput(null);
                actions.toggleShowThread(null);
            } else {
                actions.replyInput(post.id);
                actions.toggleShowThread(post.id);
            }
        } }, hyperapp_1.h("p", null, post.account.fullName), hyperapp_1.h("p", { "class": "Post__post-message", innerHTML: newMessage })), hyperapp_1.h(LikeToggle_1["default"], { state: state, actions: actions, post: post }));
};
},{"../../Api":3,"./Post.css":19,"../atoms/LikeToggle":22}],15:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
require("./PostListMenu.css");
exports["default"] = function (_a) {
    var actions = _a.actions,
        topic = _a.topic;
    return hyperapp_1.h("div", { "class": "PostListMenu" }, hyperapp_1.h("button", { "class": "PostListMenu--hide", type: "button", onclick: function (e) {
            var classList = e.target.classList;
            if (classList.contains("PostListMenu--hide")) {
                classList.remove("PostListMenu--hide");
            } else {
                classList.add("PostListMenu--hide");
            }
        } }, "..."), hyperapp_1.h("div", { "class": "PostListMenu__menu" }, hyperapp_1.h("ul", null, hyperapp_1.h("li", null, hyperapp_1.h("button", { type: "button", onclick: function () {
            actions.removeMessageList(topic.id);
        } }, "Remove this topic")))));
};
},{"./PostListMenu.css":19}],16:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
require("./ThreadPost.css");
var Post_1 = __importDefault(require("./Post"));
exports["default"] = function (_a) {
    var state = _a.state,
        listPost = _a.listPost,
        post = _a.post,
        isObserve = _a.isObserve,
        actions = _a.actions,
        view = _a.view;
    var threadPostList = [];
    var currentReplyTo = post.replyTo;
    while (currentReplyTo) {
        for (var _i = 0, listPost_1 = listPost; _i < listPost_1.length; _i++) {
            var p = listPost_1[_i];
            if (p.id === currentReplyTo) {
                threadPostList.unshift(p);
                currentReplyTo = p.replyTo;
                break;
            }
        }
    }
    return hyperapp_1.h("div", { "class": "ThreadPost" }, threadPostList.map(function (thread, i) {
        return hyperapp_1.h("div", { "class": "ThreadPost__container" }, hyperapp_1.h(Post_1["default"], { state: state, post: thread, isObserve: isObserve, actions: actions, view: view }), function (p) {
            // draw reply line
            if (p.replyTo) {
                return hyperapp_1.h("div", { className: "PostList__reply-line" });
            }
        }(thread));
    }));
};
},{"./ThreadPost.css":19,"./Post":14}],9:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
var utils_1 = require("../../utils/utils");
var Input_1 = __importDefault(require("../molecules/Input"));
var Post_1 = __importDefault(require("../molecules/Post"));
require("./PostList.css");
var PostListMenu_1 = __importDefault(require("../molecules/PostListMenu"));
var ThreadPost_1 = __importDefault(require("../molecules/ThreadPost"));
exports["default"] = function (_a) {
    var state = _a.state,
        list = _a.list,
        actions = _a.actions,
        view = _a.view;
    return [hyperapp_1.h("div", { "class": "PostList__title" }, hyperapp_1.h("span", { "class": "PostList__topic-name" }, list.topic.name), hyperapp_1.h(PostListMenu_1["default"], { actions: actions, topic: list.topic })), hyperapp_1.h("ul", { "class": "PostList__scroll", oncreate: function (elm) {
            elm.scrollTop = Number.MAX_SAFE_INTEGER;
            var mo = new MutationObserver(function (mutations) {
                var addedHeight = 0;
                var isTop = utils_1.isAddedToTop(mutations.map(function (m) {
                    return m.addedNodes[0];
                }), elm.childNodes);
                if (isTop) {
                    mutations.forEach(function (m) {
                        if (m.addedNodes.length) {
                            utils_1.node2Array(m.addedNodes).forEach(function (node) {
                                addedHeight += node.offsetHeight;
                            });
                        }
                    });
                    elm.scrollTop += addedHeight;
                }
            });
            mo.observe(elm, {
                childList: true
            });
        } }, list.posts.map(function (post, i) {
        return hyperapp_1.h("li", { key: post.id, oncreate: function (elm) {
                // draw reply line
                if (elm.children[0].classList.contains("PostList__reply-line--unconnected")) {
                    elm.children[0].style.height = 10 + "px";
                } else if (elm.children[0].classList.contains("PostList__reply-line")) {
                    var parent = elm.parentElement;
                    var replyTo = parent.children[i - 1];
                    var height = elm.offsetTop - replyTo.offsetTop - 40;
                    elm.children[0].style.height = height + "px";
                }
            } }, function () {
            // draw reply line
            var prev = list.posts[i - 1];
            if (prev && post.replyTo === prev.id) {
                // draw line
                return hyperapp_1.h("div", { "class": "PostList__reply-line" });
            } else if (post.replyTo) {
                return hyperapp_1.h("div", { "class": "PostList__reply-line PostList__reply-line--unconnected" });
            }
        }(), view.showThread === post.id ? hyperapp_1.h(ThreadPost_1["default"], { state: state, listPost: list.posts, post: post, isObserve: i === 0, actions: actions, view: view }) : null, hyperapp_1.h(Post_1["default"], { state: state, post: post, isObserve: i === 0, actions: actions, view: view }), view.replyInput === post.id ? hyperapp_1.h(Input_1["default"], { actions: actions, topic: list.topic, replyTo: view.replyInput }) : null);
    })), hyperapp_1.h(Input_1["default"], { actions: actions, topic: list.topic })];
};
},{"../../utils/utils":18,"../molecules/Input":13,"../molecules/Post":14,"./PostList.css":19,"../molecules/PostListMenu":15,"../molecules/ThreadPost":16}],10:[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
var Api_1 = require("../../Api");
require("./TopicList.css");
exports["default"] = function (_a) {
    var state = _a.state,
        actions = _a.actions;
    var visibleTopics = function () {
        if (state.topics && state.view.tabName === "all") {
            return state.topics.topics.filter(function (topic) {
                return !topic.favorite;
            });
        } else if (state.topics && state.view.tabName === "favorites") {
            return state.topics.topics.filter(function (topic) {
                return topic.favorite;
            });
        } else {
            return [];
        }
    }();
    return [hyperapp_1.h("ul", null, hyperapp_1.h("li", null, hyperapp_1.h("button", { "class": state.view.tabName === "all" ? "TopicList__tablist--selected" : null, type: "button", onclick: function () {
            actions.tabName("all");
        } }, "All")), hyperapp_1.h("li", null, hyperapp_1.h("button", { "class": state.view.tabName === "favorites" ? "TopicList__tablist--selected" : null, type: "button", onclick: function () {
            actions.tabName("favorites");
        } }, "Favorites"))), hyperapp_1.h("ul", { "class": "TopicList__list" }, visibleTopics.map(function (topic) {
        return hyperapp_1.h("li", null, hyperapp_1.h("button", { type: "button", onclick: function () {
                return __awaiter(_this, void 0, void 0, function () {
                    var messageList;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                return [4 /*yield*/, Api_1.typetalkApi.getMessageList(topic.topic.id)];
                            case 1:
                                messageList = _a.sent();
                                actions.unshiftMessageList(messageList);
                                return [2 /*return*/];
                        }
                    });
                });
            } }, topic.topic.name), hyperapp_1.h("span", null, topic.unread.count));
    }))];
};
},{"../../Api":3,"./TopicList.css":19}],5:[function(require,module,exports) {
"use strict";

var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
var PostList_1 = __importDefault(require("../organisms/PostList"));
var TopicList_1 = __importDefault(require("../organisms/TopicList"));
require("./Container.css");
exports["default"] = function (state, actions) {
    console.log("state", state);
    return hyperapp_1.h("div", { "class": "Container" }, hyperapp_1.h("div", { "class": "Container__topic-list" }, hyperapp_1.h(TopicList_1["default"], { state: state, actions: actions })), state.messageLists.map(function (list) {
        var column = state.view.columns[list.topic.id];
        return hyperapp_1.h("div", { draggable: true, ondragstart: function (e) {
                actions.dragstart(list);
            }, ondrop: function (e) {
                actions.drop(list);
            }, ondragend: function (e) {
                actions.dragend();
            }, ondragenter: function (e) {
                e.preventDefault();
            }, ondragover: function (e) {
                e.preventDefault();
            }, "class": "Container__post-list", key: list.topic.id, style: "flex-basis: " + column.width + "px" }, hyperapp_1.h(PostList_1["default"], { list: list, state: state, actions: actions, view: state.view }));
    }));
};
},{"../organisms/PostList":9,"../organisms/TopicList":10,"./Container.css":19}],4:[function(require,module,exports) {
"use strict";

exports.__esModule = true;
/**
 * アプリケーション全体の状態
 * 一個のでっかいJSON
 */
exports.state = {
    selfProfile: null,
    messageLists: [],
    topics: null,
    replies: null,
    view: {
        tabName: "favorites",
        replyInput: null,
        columns: {},
        showThread: null,
        draggingMessageList: null
    }
};
},{}],1:[function(require,module,exports) {
"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = this && this.__generator || function (thisArg, body) {
    var _ = { label: 0, sent: function () {
            if (t[0] & 1) throw t[1];return t[1];
        }, trys: [], ops: [] },
        f,
        y,
        t,
        g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
        return this;
    }), g;
    function verb(n) {
        return function (v) {
            return step([n, v]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0:case 1:
                    t = op;break;
                case 4:
                    _.label++;return { value: op[1], done: false };
                case 5:
                    _.label++;y = op[1];op = [0];continue;
                case 7:
                    op = _.ops.pop();_.trys.pop();continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];t = op;break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];_.ops.push(op);break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [6, e];y = 0;
        } finally {
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = this && this.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
var _this = this;
exports.__esModule = true;
var hyperapp_1 = require("hyperapp");
var Actions_1 = __importDefault(require("./Actions"));
var Api_1 = require("./Api");
var Container_1 = __importDefault(require("./components/templates/Container"));
var State_1 = require("./State");
var actions = hyperapp_1.app(State_1.state, new Actions_1["default"](), Container_1["default"], document.body);
// initialize
(function () {
    return __awaiter(_this, void 0, void 0, function () {
        var topics, selfProfile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    return [4 /*yield*/, Api_1.typetalkApi.getToken()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, Api_1.typetalkApi.getTopics()];
                case 2:
                    topics = _a.sent();
                    actions.topics(topics);
                    // Streaming apiからイベントを受け取る
                    Api_1.typetalkApi.startStreaming();
                    Api_1.typetalkApi.addEventListener("postMessage", function (stream) {
                        var data = stream.data;
                        actions.post(data.post);
                    });
                    return [4 /*yield*/, Api_1.typetalkApi.getProfile()];
                case 3:
                    selfProfile = _a.sent();
                    actions.selfProfile(selfProfile);
                    return [2 /*return*/];
            }
        });
    });
})();
},{"./Actions":2,"./Api":3,"./components/templates/Container":5,"./State":4}]},{},[1])
//# sourceMappingURL=/index.map