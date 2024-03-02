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

export const fetchRepos = async (token: string) => {
    const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/repos' : 'https://notebites.app/repos'}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

export const postDoc = async (token: string, githubFileUrl: string) => {
    try {
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/file-docs' : 'https://notebites.app/file-docs'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(
                {
                    "github_url": githubFileUrl
                }
            ),
        });
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.id;
        // navigate(`/docs/file/${id}`);
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const postRepo = async (token: string, githubRepoUrl: string) => {
    try {
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/repos' : 'https://notebites.app/repos'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(
                {
                    "github_url": githubRepoUrl
                }
            ),
        });
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const postIdentify = async (token: string, githubUrl: string) => {
    try {
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? '/repos/identify' : 'https://notebites.app/repos/identify'}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(
                {
                    "github_url": githubUrl
                }
            ),
        });
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const postConfirm = async (token: string, id: string) => {
    try {
        const response = await fetch(`${process.env.NODE_ENV === 'development' ? `repos/${id}/generate` : `https://notebites.app/repos/${id}/generate`}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        return data.id;
    } catch (error) {
        console.error(error);
        throw error;
    }
}