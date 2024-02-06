export const fetchDoc = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/file-docs/' : 'https://notebites.app/file-docs/'}${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const fetchRepoDoc = async (repoId: string, fileId: string, token: string) => {
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/repos/' : 'https://notebites.app/repos/'}${repoId}/${fileId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
};

export const fetchRepo = async (id: string, token: string) => {
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/repos/' : 'https://notebites.app/repos/'}${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}