export function mockDeferredAjax() {
    const requests = [];
    return {
        requests,
        ajax(options) {
            const request = { options };
            requests.push(request);
            return {
                done(callback) { request.resolve = callback; return this; },
                fail(callback) { request.reject = callback; return this; }
            };
        }
    };
}
