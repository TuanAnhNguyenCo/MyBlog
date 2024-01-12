from flask import Flask, jsonify, request
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "http://localhost:3000",
            "methods": ["GET", "POST", "OPTIONS"],  # Add OPTIONS method
            "headers": ["Content-Type"],
        }
    },
)


accounts = pd.read_json("account.json")
blogs = pd.read_json("blogs.json")
comments = pd.read_json("comments.json")


def getCommentByIDs(id):

    comments_list = []

    matching_comments = comments.loc[comments['blog_id']
                                     == id].to_numpy().tolist()[::-1]

    # Iterate through the comments and update the username

    for cm in matching_comments:
        # print(cm[1])
        account_info = accounts.loc[accounts['id']
                                    == cm[1]].values
        if len(account_info) > 0:
            cm[1] = str(account_info[0][1])

    # Extend the comments_list with the updated comments
    comments_list.extend(matching_comments)

    return comments_list


@app.route('/api/blog', methods=['GET'])
def hello():
    blog_list = []
    # Lấy số lượng dòng trong DataFrame
    num_rows = blogs.shape[0]

    # Lặp qua DataFrame từ cuối file lên
    for i in range(num_rows - 1, -1, -1):
        blog = blogs.iloc[i]
        blog_list.append(
            {
                'id': int(blog['id']),
                'user_id': int(blog['user_id']),
                'title': blog['title'],
                'content': blog['content'],
                'comments': getCommentByIDs(int(blog['id'])),
                # Replace with your actual URL
                'img_url': blog['img_url'] if blog['img_url'] != "NULL" else "",
                "audio_url": blog['audio_url'] if blog['audio_url'] != "NULL" else ""
            }
        )
    return jsonify(blogs=blog_list)


@app.route('/api/users', methods=['GET'])
def getUsers():
    users = []
    for i, account in accounts.iterrows():

        users.append(
            {
                'id': account['id'],
                'username': account['username']
            }
        )
    return jsonify(users=users)


@app.route('/api/login', methods=['POST'])
def check_account():
    # Get account details from the request
    account_data = request.json
    if len(accounts.loc[(accounts['username'] == account_data['username']) & (accounts['password'] == str(account_data['password']))]) != 0:

        id = accounts.loc[(accounts['username'] == account_data['username']) & (
            accounts['password'] == str(account_data['password']))]['id']
        response = {'status': 'success',
                    'message': 'Account is valid',
                    'id': str(id.iloc[0])}

    else:
        response = {'status': 'error',
                    'message': 'Invalid account',
                    "id": "0"}

    return jsonify(response)


@app.route('/api/upload_file', methods=['POST'])
def upload_file():
    try:
        files = request.files.getlist('files')
        save_folder = '/Users/tuananh/Desktop/Dev/my-blog-app/public/uploads/'

        if not os.path.exists(save_folder):
            os.makedirs(save_folder)

        for file in files:
            file.save(os.path.join(save_folder, file.filename))

        response = {'status': 'success'}
    except Exception as e:
        response = {'status': 'failed'}
    return jsonify(response)


@app.route('/api/create-blog', methods=['POST'])
def create_blog():
    base_url = "uploads/"
    # Retrieve data from the request
    blog_title = request.json.get('title')
    blog_content = request.json.get('content')
    audio_url = request.json.get('audio_url')
    img_url = request.json.get('img_url')
    blogs.loc[len(blogs)] = pd.Series({
        'id': blogs['id'].max() + 1 if len(blogs) != 0 else 1,
        'user_id':  request.json.get('user_id'),
        'title': blog_title,  # Replace with your actual title
        'content': blog_content,  # Replace with your actual content
        'img_url': base_url + img_url,  # Replace with your actual URL
        "audio_url": base_url + audio_url
    })
    blogs.to_json("blogs.json")

    # Process the data and files here (e.g., store in a database)

    # Return a response indicating success or failure
    response = {'message': 'Blog post created successfully'}
    return jsonify(response)


@app.route('/api/create-comment', methods=['POST'])
def create_comment():

    # Retrieve data from the request
    user_id = request.json.get('user_id')
    blog_id = request.json.get('blog_id')
    content = request.json.get('content')

    comments.loc[len(comments)] = pd.Series({
        'id': comments['id'].max() + 1 if len(comments) != 0 else 1,
        'user_id':  int(user_id),
        'blog_id': blog_id,  # Replace with your actual title
        'content': content,  # Replace with your actual content
    })
    comments.to_json("comments.json")

    # Process the data and files here (e.g., store in a database)

    # Return a response indicating success or failure
    response = {'message': 'Blog post created successfully'}
    return jsonify(response)


@app.route('/api/create/account', methods=['POST'])
def create_account():

    # Retrieve data from the request
    username = request.json.get('username')

    if len(accounts.loc[accounts['username'] == username]) == 0:
        accounts.loc[len(accounts)] = pd.Series({
            'id': accounts['id'].max() + 1 if len(accounts) != 0 else 1,
            'username': username,
            "password": str(1)
        })
        accounts.to_json("account.json")

    response = {'message': 'Account created successfully'}
    return jsonify(response)


if __name__ == '__main__':
    app.run(debug=True)
