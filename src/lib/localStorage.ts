// Backend API service to replace localStorage functionality
export type Profile = {
  id: string;
  full_name: string;
  role: 'citizen' | 'admin';
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
  full_name: string;
  role: 'citizen' | 'admin';
  created_at: string;
  updated_at: string;
};

export type Issue = {
  id: string;
  user_id: string;
  issue_type: 'pothole' | 'garbage' | 'streetlight' | 'other';
  description: string;
  photo_url?: string;
  latitude: number;
  longitude: number;
  location_address?: string;
  status: 'pending' | 'in_progress' | 'resolved';
  admin_notes?: string;
  created_at: string;
  updated_at: string;
};

// Backend API service
class BackendAPIService {
  private baseURL = 'http://localhost:3001/api';

  // User management
  async createUser(email: string, password: string, fullName: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, fullName }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { user: null, error: new Error(data.error || 'Failed to create user') };
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async authenticateUser(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { user: null, error: new Error(data.error || 'Authentication failed') };
      }

      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  // Issue management
  async createIssue(issueData: Omit<Issue, 'id' | 'created_at' | 'updated_at'>): Promise<{ issue: Issue | null; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { issue: null, error: new Error(data.error || 'Failed to create issue') };
      }

      return { issue: data.issue, error: null };
    } catch (error) {
      return { issue: null, error: error as Error };
    }
  }

  async getIssues(): Promise<{ issues: Issue[]; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/issues`);
      const data = await response.json();

      if (!response.ok) {
        return { issues: [], error: new Error(data.error || 'Failed to fetch issues') };
      }

      return { issues: data.issues, error: null };
    } catch (error) {
      return { issues: [], error: error as Error };
    }
  }

  async getUserIssues(userId: string): Promise<{ issues: Issue[]; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/users/${userId}/issues`);
      const data = await response.json();

      if (!response.ok) {
        return { issues: [], error: new Error(data.error || 'Failed to fetch user issues') };
      }

      return { issues: data.issues, error: null };
    } catch (error) {
      return { issues: [], error: error as Error };
    }
  }

  async updateIssueStatus(issueId: string, status: Issue['status']): Promise<{ issue: Issue | null; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/issues/${issueId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { issue: null, error: new Error(data.error || 'Failed to update issue') };
      }

      return { issue: data.issue, error: null };
    } catch (error) {
      return { issue: null, error: error as Error };
    }
  }

  async updateIssueAdminNotes(issueId: string, adminNotes: string): Promise<{ issue: Issue | null; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/issues/${issueId}/admin-notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { issue: null, error: new Error(data.error || 'Failed to update admin notes') };
      }

      return { issue: data.issue, error: null };
    } catch (error) {
      return { issue: null, error: error as Error };
    }
  }

  async getIssueById(issueId: string): Promise<{ issue: Issue | null; error: Error | null }> {
    try {
      const response = await fetch(`${this.baseURL}/issues/${issueId}`);
      const data = await response.json();

      if (!response.ok) {
        return { issue: null, error: new Error(data.error || 'Failed to fetch issue') };
      }

      return { issue: data.issue, error: null };
    } catch (error) {
      return { issue: null, error: error as Error };
    }
  }

  async exportAllData(): Promise<void> {
    try {
      // Get all issues
      const { issues } = await this.getIssues();
      
      // Create downloadable JSON files
      const issuesBlob = new Blob([JSON.stringify(issues, null, 2)], { type: 'application/json' });
      const issuesUrl = URL.createObjectURL(issuesBlob);
      
      // Create download link
      const link = document.createElement('a');
      link.href = issuesUrl;
      link.download = `issues-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(issuesUrl);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }
}

export const localStorageService = new BackendAPIService();