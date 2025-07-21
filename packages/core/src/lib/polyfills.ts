if (typeof (Object as unknown as { hasOwn?: unknown }).hasOwn !== 'function') {
  Object.defineProperty(Object, 'hasOwn', {
    value: function (obj: unknown, prop: PropertyKey): boolean {
      if (obj == null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      return Object.prototype.hasOwnProperty.call(Object(obj), prop);
    },
    configurable: true,
    writable: true,
    enumerable: false,
  });
}
