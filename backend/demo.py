import pandas as pd
import numpy as np

comments = pd.read_json('comments.json')
accounts = pd.read_json('account.json')


def getCommentByIDs(id):

    comments_list = []

    matching_comments = comments.loc[comments['blog_id']
                                     == id].to_numpy().tolist()

    # Iterate through the comments and update the username
    
    for cm in matching_comments:
        # print(cm[1])
        account_info = accounts.loc[accounts['id']
                                    == cm[1]].values
        if len(account_info) > 0:
            cm[1] = str(account_info[0])

    # Extend the comments_list with the updated comments
    comments_list.extend(matching_comments)

    return comments_list


# getCommentByIDs(1)
print(getCommentByIDs(1))


