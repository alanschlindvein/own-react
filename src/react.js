(() => {
   let rootDOMElement, rootReactElement;
   const REACT_CLASS = 'REACT_CLASS';

   function anElement(elem, props, children) {
      if(isClass(elem)) {
         return handleClass(elem, props, children);
      }
      if(isStateLessComponent(elem)) {
         return elem(props);
      }
      return handleHtmlElement(elem, props, children);
   }

   function handleHtmlElement(elem, props, children) {
      const anElement = document.createElement(elem);
      children.forEach(child => appendChild(anElement, child));

      Object.keys(props || {}).forEach(key => appendProp(anElement, key, props[key]));

      return anElement;
   }

   function handleClass(clazz, props, children) {
      const reactElement = new clazz(props);
      reactElement.children = children;
      reactElement.type = REACT_CLASS;
      return reactElement;
   }

   function createElement(el, props, ...children) {
      return anElement(el, props, children);
   }

   function reRender() {
      while (rootDOMElement.hasChildNodes()) {
         rootDOMElement.removeChild(rootDOMElement.lastChild);
      }
      ReactDOM.render(rootReactElement, rootDOMElement);
   }

   function appendChild(element, child) {
      if(child.type === REACT_CLASS) {
         appendChild(element, child.render());
         return;
      }
      if(Array.isArray(child)) {
         child.forEach(ch => appendChild(element, ch));
         return;
      }
      if(typeof(child) === 'object') {
         element.appendChild(child);
         return;
      }
         element.innerHTML += child;
   }

   function appendProp(element, propName, propVal) {
      if(shouldAddEventListener(propName)) {
         element.addEventListener(propName.substring(2).toLowerCase(), propVal);
         return;
      }
      element.setAttribute(propName, propVal);
   }

   class Component {

      constructor(props) {
         this.props = props;
      }

      setState(state) {
         this.state = Object.assign({}, this.state, state);
         reRender();
      }
   }

   window.React = {
      createElement,
      Component
   };

   window.ReactDOM = {
      render: (el, domEl) => {
         rootReactElement = el;
         rootDOMElement = domEl;
         const currentDOM = rootReactElement.render();
         rootDOMElement.appendChild(currentDOM);
      }
   };
})();
