import os
import glob
import google.generativeai as genai
from typing import List, Dict, Tuple
import yaml
from pathlib import Path

class LLMRuleChecker:
    def __init__(self, api_key: str):
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        self.rules_cache = {}

    def load_rules(self, rules_dir: str) -> List[Dict]:
        """Load and sort rules by their numeric prefix."""
        rules = []
        rule_files = glob.glob(os.path.join(rules_dir, "*.md"))
        
        for rule_file in sorted(rule_files):
            with open(rule_file, 'r') as f:
                content = f.read()
                rule_number = int(Path(rule_file).stem.split('-')[0])
                rules.append({
                    'number': rule_number,
                    'content': content,
                    'file': rule_file
                })
        
        return sorted(rules, key=lambda x: x['number'])

    def check_file(self, file_path: str, rules: List[Dict]) -> List[Dict]:
        """Check a single file against all rules."""
        results = []
        
        with open(file_path, 'r') as f:
            file_content = f.read()

        for rule in rules:
            prompt = f"""
            Analyze the following code against this rule:
            
            RULE:
            {rule['content']}
            
            CODE:
            {file_content}
            
            Provide a JSON response with the following structure:
            {{
                "compliant": boolean,
                "issues": [list of specific issues if any],
                "suggestions": [specific suggestions for fixing each issue],
                "rule_number": {rule['number']}
            }}
            
            Be specific and actionable in your response.
            """

            try:
                response = self.model.generate_content(prompt)
                result = yaml.safe_load(response.text)
                result['rule_file'] = rule['file']
                results.append(result)
            except Exception as e:
                results.append({
                    'compliant': False,
                    'issues': [f"Error analyzing rule {rule['number']}: {str(e)}"],
                    'suggestions': ["Please review manually"],
                    'rule_number': rule['number'],
                    'rule_file': rule['file']
                })

        return results

    def generate_report(self, results: List[Dict], file_path: str) -> str:
        """Generate a formatted report from the results."""
        report = f"\nAnalysis Report for {file_path}\n{'='*50}\n\n"
        
        # Group results by compliance
        compliant = []
        non_compliant = []
        
        for result in results:
            if result['compliant']:
                compliant.append(result)
            else:
                non_compliant.append(result)

        # Report non-compliant rules first
        if non_compliant:
            report += "❌ Rules Violations Found:\n\n"
            for result in non_compliant:
                report += f"Rule {result['rule_number']} ({Path(result['rule_file']).stem}):\n"
                for issue, suggestion in zip(result['issues'], result['suggestions']):
                    report += f"  • Issue: {issue}\n"
                    report += f"    Solution: {suggestion}\n"
                report += "\n"

        # Report compliant rules
        if compliant:
            report += "✅ Compliant with Rules:\n"
            for result in compliant:
                report += f"  • Rule {result['rule_number']} ({Path(result['rule_file']).stem})\n"

        return report

def main():
    # Get API key from environment variable
    api_key = os.getenv('GEMINI_API_KEY')
    if not api_key:
        raise ValueError("Please set GEMINI_API_KEY environment variable")

    checker = LLMRuleChecker(api_key)
    
    # Load rules from .llm-rules directory
    rules = checker.load_rules('.llm-rules')
    
    # Get files to check (you might want to modify this based on your needs)
    files_to_check = glob.glob('src/**/*.{ts,tsx}', recursive=True)
    
    # Process each file
    for file_path in files_to_check:
        results = checker.check_file(file_path, rules)
        report = checker.generate_report(results, file_path)
        print(report)
        
        # Optionally save to a report file
        with open(f"reports/{Path(file_path).stem}_report.txt", 'w') as f:
            f.write(report)

if __name__ == "__main__":
    main()