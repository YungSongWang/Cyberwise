/**
 * AI Writing Client - 前端调用示例
 * 用于调用AI文本分析API
 */

class AIWritingClient {
    constructor(apiBaseUrl = 'http://localhost:5001') {
        this.apiBaseUrl = apiBaseUrl;
    }

    /**
     * 生成AI内容
     * @param {string} prompt - 写作提示
     * @returns {Promise<Object>} API响应结果
     */
    async generateContent(prompt) {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/generate-content`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: prompt })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || '生成内容失败');
            }

            const result = await response.json();
            return result;

        } catch (error) {
            console.error('AI内容生成错误:', error);
            throw error;
        }
    }

    /**
     * 检查API服务器健康状态
     * @returns {Promise<boolean>} 服务器是否正常
     */
    async checkHealth() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/health`);
            return response.ok;
        } catch (error) {
            console.error('健康检查失败:', error);
            return false;
        }
    }
}

// 使用示例
/*
const aiClient = new AIWritingClient('http://localhost:5001');

// 生成内容
aiClient.generateContent('人工智能')
    .then(result => {
        console.log('标题:', result.title);
        console.log('内容:', result.content);
    })
    .catch(error => {
        console.error('错误:', error.message);
    });

// 检查服务器状态
aiClient.checkHealth()
    .then(isHealthy => {
        console.log('服务器状态:', isHealthy ? '正常' : '异常');
    });
*/

// 如果在Node.js环境中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIWritingClient;
}

// 如果在浏览器环境中使用
if (typeof window !== 'undefined') {
    window.AIWritingClient = AIWritingClient;
} 