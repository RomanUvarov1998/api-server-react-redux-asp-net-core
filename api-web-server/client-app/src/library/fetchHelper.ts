export function myFetch(
    url: string,
    method: string | undefined = 'GET',
    body: string | undefined = undefined,
    myThen: (value: string) => void | null
) {
    fetch(url, { method, body })
        .then(response => {
            if (!response.ok) {
                console.error(response.statusText);
            }
            return response.text();
        })
        .then(text => {
            try {
                myThen(text);
            }
            catch (e) {
                let rootElement = document.getElementById("root");
                const message = `text:\n${text}\n\ne:\n${e.toString()}`;
                if (rootElement) {
                    rootElement.innerHTML = message
                }
                console.log(message);
            }
        });
}