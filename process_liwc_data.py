import csv
import json

# 读取AI LIWC数据
ai_data = []
with open('task/task 5/Task5_AI.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        ai_data.append(row)

# 读取Human LIWC数据
human_data = []
with open('task/task 5/Task5_Human.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        human_data.append(row)

print(f'AI数据条数: {len(ai_data)}')
print(f'Human数据条数: {len(human_data)}')

# 合并数据，以index为键
liwc_data = {}
for i, (ai_row, human_row) in enumerate(zip(ai_data, human_data)):
    index = i + 1  # index从1开始
    liwc_data[index] = {
        'ai_liwc': ai_row,
        'human_liwc': human_row
    }

# 保存为JSON文件
with open('static/data/liwc_data.json', 'w', encoding='utf-8') as f:
    json.dump(liwc_data, f, ensure_ascii=False, indent=2)

print('LIWC数据已保存到 static/data/liwc_data.json') 