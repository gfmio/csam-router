//
// Router module
//

const rlite = require('rlite-router')

//
// Router
//

const Router = function(props, children) {
  var props = props
  var children = children
  if ((props === null) || (props === undefined)) {
    props = {}
  }
  if ((children === undefined) || (children === null)) {
    children = []
  }

  const Router = function(props, children) {
    var props = props
    var children = children

    //
    // Default Error Route
    //
    var errorRoute = undefined

    const parseAllChildRoutes = function(children, prefix, parentFunction) {
      var prefix = prefix
      var children = children
      var parentFunction = parentFunction
      if (prefix === undefined) {
        prefix = ''
      }
      if (children === undefined) {
        children = []
      }

      if (parentFunction === undefined) {
        parentFunction = function(props, children) {
          return children
        }
      }

      var routes = {}

      for (var n in children) {
        var child = children[n]

        if ((errorRoute === undefined) && (child.props.path === null)) {
          errorRoute = function() {
            return child
          }

          continue
        }

        if (child.children.length === 0) {
          routes[prefix + child.props.path] = function(o) {
            return function (props, children) {
              return parentFunction({}, [child.props.component(props, children)])
            }
          }

          if (child.props.path === '') {
            routes[prefix + child.props.path + '/'] = function(o) {
              return function (props, children) {
                return parentFunction({}, [child.props.component(props, children)])
              }
            }
          }
        } else {
          routes = Object.assign({}, routes, parseAllChildRoutes(
            child.children,
            prefix + child.props.path,
            function (props, children) {
              return parentFunction([child.props.component(props, children)])
            }
          ))
        }
      }

      return routes
    }

    routes = parseAllChildRoutes(children)

    if (errorRoute === undefined) {
      errorRoute = function(o) {
        return function(props, children) {
          return undefined
        }
      }
    }

    var rliteRouter = rlite(errorRoute, routes)

    // console.log(routes)
    // console.log(errorRoute)
    console.log(rliteRouter('abc'))

    this.match = function(url) {
      console.log('rlite', url, rliteRouter(url))
      return rliteRouter(url)
    }
  }

  return new Router(props, children)
}

//
// Route
//

const Route = function(props, children) {
  var props = props
  if ((props === null) || (props === undefined)) {
    props = {}
  }
  if (props.props === undefined) {
    props.props = {}
  }
  if ((children === undefined) || (children === null)) {
    children = []
  }

  return new function Route() {
    this.props = props
    this.props.path = this.props.path || null
    this.props.component = this.props.component || null
    this.children = children
  }
}

//
// IndexRoute
//

const IndexRoute = function(props, children) {
  var props = props
  if ((props === null) || (props === undefined)) {
    props = { props: {} }
  }
  children = []
  props.path = ''

  return Route(props, children)
}

//
// NotFoundRoute
//

const NotFoundRoute = function(props, children) {
  var props = props
  if ((props === null) || (props === undefined)) {
    props = { props: {} }
  }
  children = []
  props.path = null
  return Route(props, children)
}

module.exports = {
  Router: Router,
  Route: Route,
  IndexRoute: IndexRoute,
  NotFoundRoute: NotFoundRoute
}
