const axios = require('axios');

async function testDatasetGen() {
    const API_URL = "http://localhost:5001/api/code/complexity";

    const cppCode = `
#include <iostream>
#include <vector>

long long comparisons = 0;
long long shifts = 0;

void insertionSort(std::vector<int>& arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (++comparisons && j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            shifts++;
            j = j - 1;
        }
        arr[j + 1] = key;
    }
}

int main() {
    int n;
    if (!(std::cin >> n)) return 0;
    std::vector<int> arr(n);
    for(int i=0; i<n; i++) std::cin >> arr[i];
    comparisons = 0;
    shifts = 0;
    insertionSort(arr);
    std::cout << "__metrics__ " << comparisons << " " << shifts << std::endl;
    return 0;
}
    `;

    const inputs = [{ label: "N=100", size: 100 }];

    const cases = ['BEST', 'WORST', 'AVERAGE'];

    for (const caseType of cases) {
        try {
            console.log(`Testing Case: ${caseType}...`);
            const response = await axios.post(API_URL, {
                code: cppCode,
                language: "cpp",
                inputs: inputs,
                case_type: caseType
            });

            const res = response.data.results[0];
            console.log(`Results for ${caseType}:`, JSON.stringify(res, null, 2));
            console.log('-------------------');

        } catch (err) {
            console.error(`Test failed for ${caseType}:`, err.response?.data || err.message);
        }
    }
}

testDatasetGen();
