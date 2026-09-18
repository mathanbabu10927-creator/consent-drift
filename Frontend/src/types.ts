export interface AnalysisResponse {
  apk_info: {
    app_name: string;
    package_name: string;
    version_name: string;
    version_code: string;
  };
  permissions: {
    all: string[];
    sensitive: string[];
  };
  analysis: {
    total_permissions: number;
    sensitive_permission_count: number;
  };
}

export interface AnalysisResult {
  label: string;
  fileName: string;
  data: AnalysisResponse;
}