import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, updateDoc, deleteDoc, serverTimestamp, onSnapshot, query, where, getCountFromServer, setDoc, deleteDoc as firestoreDeleteDoc } from 'firebase/firestore';
import { FaUserCircle } from 'react-icons/fa';
import { AiOutlineSend, AiOutlineLike, AiFillEdit, AiFillDelete } from 'react-icons/ai';
import { Mention, MentionsInput } from 'react-mentions';

const mentionStyles = {
    control: {
        backgroundColor: '#f3f3f3',
        fontSize: 14,
        border: 'none',
    },
    '&multiLine': {
        control: {
            minHeight: 63,
        },
        highlighter: {
            padding: 9,
            border: '1px solid transparent',
        },
        input: {
            padding: 9,
            border: '1px solid silver',
        },
    },
    '&singleLine': {
        display: 'inline-block',
        width: 130,
    },
    suggestions: {
        list: {
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.15)',
            fontSize: 14,
        },
        item: {
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#cee4e5',
            },
        },
    },
    mention: {
        backgroundColor: '#fffbcc', // Light yellow background to highlight
        color: '#ff4500',           // Orange color for mention text
        padding: '0 2px',
        borderRadius: '2px',
        fontWeight: 'bold',
    },
};

const customMentionStyles = {
    control: {
        backgroundColor: '#f3f3f3',
        fontSize: 14,
        border: 'none',
        width: '100%',
    },
};

const commentContainerStyle = {
    padding: '10px',
    border: '1px solid #e5e5e5',
    borderRadius: '5px',
    marginBottom: '10px',
    backgroundColor: '#ffffff',
};

const mentionHighlightStyle = {
    backgroundColor: '#fff7e6', // Light orange background for highlighted comments
};

const mentionTextStyle = {
    backgroundColor: '#fffbcc', // Light yellow background for mention text
    color: '#ff4500',           // Orange color for mention text
    padding: '0 2px',
    borderRadius: '2px',
    fontWeight: 'bold',
};

const Comment = ({ courseId = '', chapterName = '', topicName = '', videoId = '' }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('Anonymous');
    const [userProfilePic, setUserProfilePic] = useState('');
    const [visibleComments, setVisibleComments] = useState(7);
    const [expandedComments, setExpandedComments] = useState({});
    const [userLikes, setUserLikes] = useState(new Set());
    const [currentUser, setCurrentUser] = useState(null);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [editingReplyId, setEditingReplyId] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [users, setUsers] = useState([]); // Store all users for mentions
    const [sortMode, setSortMode] = useState('newest'); // newest, likes, mentions

    const auth = getAuth();
    const db = getFirestore();

    useEffect(() => {
        const fetchUserDetails = async () => {
            const user = auth.currentUser;
            setCurrentUser(user);

            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userRef);
                if (userDoc.exists()) {
                    setUserName(userDoc.data().name || 'Anonymous');
                    setUserProfilePic(userDoc.data().profilePhoto || '');
                }
            }
        };

        fetchUserDetails();
    }, [auth, db]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersRef = collection(db, 'users');
            const usersSnapshot = await getDocs(usersRef);
            setUsers(usersSnapshot.docs.map((userDoc) => ({ id: userDoc.id, ...userDoc.data() })));
        };

        fetchUsers();
    }, [db]);

    useEffect(() => {
        const fetchUserLikes = async () => {
            const user = auth.currentUser;
            if (user) {
                const likesRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'likes');
                const likesSnapshot = await getDocs(query(likesRef, where('userId', '==', user.uid)));
                const likedComments = new Set(likesSnapshot.docs.map((likeDoc) => likeDoc.id));
                setUserLikes(likedComments);
            }
        };

        fetchUserLikes();
    }, [auth, db, courseId, chapterName, topicName, videoId]);

    useEffect(() => {
        if (!courseId || !chapterName || !topicName || !videoId) return;

        const commentsRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments');
        const unsubscribeComments = onSnapshot(commentsRef, async (snapshot) => {
            const fetchedComments = await Promise.all(snapshot.docs.map(async (commentDoc) => {
                const data = commentDoc.data();
                const likesRef = collection(commentDoc.ref, 'likes');
                const likesSnapshot = await getCountFromServer(likesRef);

                const createdAt = data.createdAt ? new Date(data.createdAt.seconds * 1000) : new Date();

                // Fetch mentions
                const mentions = (data.text || "").match(/\$[^\s]+/g) || [];
                const isMentioned = mentions.some((mention) => users.find((user) => `$${user.name}` === mention && user.id === currentUser?.uid));
                const isMentionedByUser = mentions.includes(`$${userName}`);

                // Fetch replies
                const repliesRef = collection(commentDoc.ref, 'replies');
                const repliesSnapshot = await getDocs(repliesRef);
                const replies = await Promise.all(repliesSnapshot.docs.map(async (replyDoc) => {
                    const replyData = replyDoc.data();
                    return {
                        id: replyDoc.id,
                        text: replyData.text,
                        userName: replyData.userName,
                        userId: replyData.userId,
                        createdAt: new Date(replyData.createdAt.seconds * 1000),
                        profilePhoto: replyData.profilePhoto || '',
                        edited: replyData.edited || false,
                    };
                }));

                return {
                    id: commentDoc.id,
                    text: data.text,
                    userName: data.userName,
                    userId: data.userId,
                    edited: data.edited || false,
                    createdAt: createdAt,
                    profilePhoto: data.profilePhoto || '',
                    likes: likesSnapshot.data().count || 0,
                    replies: replies,
                    isMentioned: isMentioned, // Add mention status
                    isMentionedByUser: isMentionedByUser,
                };
            }));

            // Sorting logic based on the selected mode
            let sortedComments = [...fetchedComments];
            switch (sortMode) {
                case 'newest':
                    sortedComments = sortedComments.sort((a, b) => b.createdAt - a.createdAt);
                    break;
                case 'likes':
                    sortedComments = sortedComments.sort((a, b) => b.likes - a.likes);
                    break;
                case 'mentions':
                    sortedComments = sortedComments.filter((comment) => comment.isMentioned || comment.isMentionedByUser);
                    break;
                default:
                    break;
            }

            setComments(sortedComments);
        });

        return () => {
            unsubscribeComments();
        };
    }, [auth.currentUser, db, courseId, chapterName, topicName, videoId, users, sortMode]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment) return;

        const user = auth.currentUser;
        if (user) {
            try {
                if (!courseId || !chapterName || !topicName || !videoId) {
                    throw new Error('Missing required parameters.');
                }

                const commentsRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments');

                // Replace mentions in the comment text with username
                const replacedText = newComment.split(' ').map((part) => {
                    if (part.startsWith('$')) {
                        const mentionedUser = users.find((user) => `$${user.name}` === part);
                        return mentionedUser ? `@${mentionedUser.name}` : part;
                    }
                    return part;
                }).join(' ');

                const newCommentData = {
                    text: replacedText,
                    userId: user.uid,
                    userName: userName,
                    createdAt: serverTimestamp(),
                    profilePhoto: userProfilePic || '',
                    edited: false,
                    likes: 0,
                };

                const docRef = await addDoc(commentsRef, newCommentData);

                setComments((prevComments) => [{ ...newCommentData, id: docRef.id, createdAt: new Date(), replies: [] }, ...prevComments]);
                setNewComment('');
            } catch (error) {
                console.error('Error adding comment:', error.message || error);
            }
        }
    };


    const handleLike = async (commentId) => {
        const user = auth.currentUser;
        if (user) {
            const commentRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId);
            const likesRef = collection(commentRef, 'likes');
            const userLikeRef = doc(likesRef, user.uid);

            if (userLikes.has(commentId)) {
                await firestoreDeleteDoc(userLikeRef);
                const updatedLikesCount = (await getCountFromServer(likesRef)).data().count - 1;
                await updateDoc(commentRef, { likes: updatedLikesCount });
                setUserLikes((prevLikes) => {
                    const newLikes = new Set(prevLikes);
                    newLikes.delete(commentId);
                    return newLikes;
                });
            } else {
                await setDoc(userLikeRef, { userId: user.uid });
                const updatedLikesCount = (await getCountFromServer(likesRef)).data().count + 1;
                await updateDoc(commentRef, { likes: updatedLikesCount });
                setUserLikes((prevLikes) => new Set(prevLikes).add(commentId));
            }
        }
    };

    const renderTextWithMentions = (text) => {
        const mentionPattern = /@\[[^\]]+\]\([^\)]+\)/g; // Adjust the regex based on your mention format
        const parts = [];
        let lastIndex = 0;
    
        // Replace mentions with styled spans
        text.replace(mentionPattern, (match, offset) => {
            // Add text before the mention
            if (offset > lastIndex) {
                parts.push(text.slice(lastIndex, offset));
            }
    
            // Add mention in blue
            parts.push(
                <span key={offset} style={{ color: '#0000ff', fontWeight: 'bold' }}>
                    {match}
                </span>
            );
    
            lastIndex = offset + match.length;
            return match;
        });
    
        // Add remaining text after the last mention
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }
    
        return parts;
    };

    const handleEdit = (commentId) => {
        const comment = comments.find((c) => c.id === commentId);
        setEditingCommentId(commentId);
        setEditingCommentText(comment.text);
    };

    const handleSaveEdit = async (commentId) => {
        const commentRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId);
        await updateDoc(commentRef, { text: editingCommentText, edited: true });
        setComments((prevComments) =>
            prevComments.map((comment) => (comment.id === commentId ? { ...comment, text: editingCommentText, edited: true } : comment))
        );
        setEditingCommentId(null);
        setEditingCommentText('');
    };

    const handleDelete = async (commentId) => {
        const commentRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId);
        await deleteDoc(commentRef);
        setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (!replyText || !replyToCommentId) return;

        const user = auth.currentUser;
        if (user) {
            try {
                const replyRef = collection(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', replyToCommentId, 'replies');
                const newReplyData = {
                    text: replyText,
                    userId: user.uid,
                    userName: userName,
                    createdAt: serverTimestamp(),
                    profilePhoto: userProfilePic || '',
                    edited: false,
                };

                const docRef = await addDoc(replyRef, newReplyData);

                setComments((prevComments) => {
                    const updatedComments = prevComments.map((comment) => {
                        if (comment.id === replyToCommentId) {
                            return {
                                ...comment,
                                replies: [{ ...newReplyData, id: docRef.id, createdAt: new Date() }, ...comment.replies],
                            };
                        }
                        return comment;
                    });
                    return updatedComments;
                });

                setReplyText('');
                setReplyToCommentId(null);
            } catch (error) {
                console.error('Error adding reply:', error.message || error);
            }
        }
    };

    const handleEditReply = (replyId, commentId) => {
        const comment = comments.find((c) => c.id === commentId);
        const reply = comment.replies.find((r) => r.id === replyId);
        setEditingReplyId(replyId);
        setReplyToCommentId(commentId);
        setReplyText(reply.text);
    };

    const handleSaveEditReply = async (replyId, commentId) => {
        const replyRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId, 'replies', replyId);
        await updateDoc(replyRef, { text: replyText, edited: true });
        setComments((prevComments) => {
            const updatedComments = prevComments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.map((reply) => (reply.id === replyId ? { ...reply, text: replyText, edited: true } : reply)),
                    };
                }
                return comment;
            });
            return updatedComments;
        });
        setReplyToCommentId(null);
        setReplyText('');
        setEditingReplyId(null);
    };

    const handleDeleteReply = async (replyId, commentId) => {
        const replyRef = doc(db, 'courseComments', courseId, 'chapters', chapterName, 'topics', topicName, 'videos', videoId, 'comments', commentId, 'replies', replyId);
        await deleteDoc(replyRef);
        setComments((prevComments) => {
            const updatedComments = prevComments.map((comment) => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: comment.replies.filter((reply) => reply.id !== replyId),
                    };
                }
                return comment;
            });
            return updatedComments;
        });
    };

    const renderProfilePic = (photoUrl) => {
        if (photoUrl) {
            return <img src={photoUrl} alt="Profile" className="w-10 h-10 rounded-full object-cover" />;
        }
        return <FaUserCircle className="w-10 h-10 text-gray-400" />;
    };

    const toggleCommentExpand = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const formatText = (content) => {
        return content.split(' ').map((part, index) => {
            if (part.startsWith('@')) {
                const user = users.find((user) => `@${user.name}` === part);
                if (user && user.name) { // Ensure user and user.name are defined
                    const spanStyle = {
                        color: '#ff4500',
                        backgroundColor: '#fffbcc',
                        fontWeight: 'bold',
                        padding: '0 2px',
                        borderRadius: '2px'
                    };
                    return (
                        <span key={index} style={spanStyle}>
                            {part}
                        </span>
                    );
                }
            }
            return part + ' ';
        });
    };

    const renderCommentText = (comment) => {
        const isExpanded = expandedComments[comment.id];
        const text = comment.text || '';
        const lines = text.split('\n');
        const isLong = lines.length > 3;
    
        if (editingCommentId === comment.id) {
            return (
                <div>
                    <MentionsInput
                        value={editingCommentText}
                        onChange={(e) => setEditingCommentText(e.target.value)}
                        style={mentionStyles.control}
                    >
                        <Mention
                            trigger="@"
                            data={users.map((user) => ({ id: user.id, display: user.name }))}
                            displayTransform={(id, display) => `@${display}`}
                        />
                    </MentionsInput>
                    <div style={{ display: 'flex', marginTop: '8px' }}>
                        <button onClick={() => handleSaveEdit(comment.id)} style={{ padding: '8px 16px', backgroundColor: '#38a169', color: 'white', borderRadius: '9999px', marginRight: '8px' }}>
                            Save
                        </button>
                        <button onClick={() => setEditingCommentId(null)} style={{ padding: '8px 16px', backgroundColor: '#e53e3e', color: 'white', borderRadius: '9999px' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            );
        }
    
        if (isLong && !isExpanded) {
            return (
                <>
                    {formatText(lines.slice(0, 3).join('\n'))}
                    <button onClick={() => toggleCommentExpand(comment.id)} style={{ color: '#4299e1', cursor: 'pointer' }}>
                        Read More
                    </button>
                </>
            );
        }
    
        return (
            <>
                {formatText(text)}
                {comment.edited && <p style={{ color: '#a0aec0', fontStyle: 'italic' }}>Edited</p>}
                {isLong && (
                    <button onClick={() => toggleCommentExpand(comment.id)} style={{ color: '#4299e1', cursor: 'pointer' }}>
                        Show Less
                    </button>
                )}
            </>
        );
    };
    // Insert the same formatting logic for replies as well

    const renderReplies = (comment) => {
        return (
            <ul className="ml-6 mt-4 space-y-2">
                {comment.replies.map((reply) => (
                    <li key={reply.id} className={`flex space-x-4 ${comment.userId === reply.userId ? 'bg-yellow-100' : ''}`}>
                        {renderProfilePic(reply.profilePhoto)}
                        <div>
                            <p className="font-semibold text-gray-700">{reply.userName}</p>
                            {editingReplyId === reply.id ? (
                                <div>
                                    <MentionsInput
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-lg"
                                        placeholder="Edit your reply..."
                                        style={customMentionStyles}
                                    >
                                        <Mention
                                            trigger="$"
                                            data={users.map((user) => ({ id: user.suid, display: user.name }))}
                                            displayTransform={(id, display) => (
                                                <span style={{ color: 'blue' }}>@{display}</span>
                                            )}
                                        />

                                    </MentionsInput>
                                    <div className="flex space-x-2 mt-2">
                                        <button onClick={() => handleSaveEditReply(reply.id, comment.id)} className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700">
                                            Save
                                        </button>
                                        <button onClick={() => setEditingReplyId(null)} className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <p className="text-gray-600">{formatText(reply.text)}</p>
                                {reply.edited && <p className="text-sm text-gray-400 italic">Edited</p>}
                                <p className="mt-1 text-sm text-gray-400">{reply.createdAt.toLocaleString()}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {reply.userId === currentUser?.uid && (
                                        <>
                                            <button onClick={() => handleEditReply(reply.id, comment.id)} className="flex items-center text-gray-500 hover:text-green-500">
                                                <AiFillEdit className="mr-1" />
                                            </button>
                                            <button onClick={() => handleDeleteReply(reply.id, comment.id)} className="flex items-center text-gray-500 hover:text-red-500">
                                                <AiFillDelete className="mr-1" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
};
   

    const renderSortOptions = () => {
        return (
            <div className="mb-6">
                <label className="mr-2 font-semibold text-gray-700" htmlFor="sortOptions">Sort by:</label>
                <select
                    id="sortOptions"
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    value={sortMode}
                    onChange={(e) => setSortMode(e.target.value)}
                >
                    <option value="newest">Newest</option>
                    <option value="likes">Most Liked</option>
                   
                </select>
            </div>
        );
    };

   return (
    <div className="mt-8 px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments ({comments.length})</h2>
        {renderSortOptions()}
        <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="flex space-x-4 items-start">
                {renderProfilePic(userProfilePic)}
                <MentionsInput
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                    placeholder="Add a comment..."
                    style={mentionStyles}
                >
                    <Mention
                        trigger="$"
                        data={users.map((user) => ({
                            id: user.suid || '',  // Ensure id is defined
                            display: user.name || ''  // Ensure display is defined
                        }))}
                        displayTransform={(id, display) => `$${display}`}
                    />
                </MentionsInput>
            </div>
            <div className="flex justify-end mt-2">
                <button
                    type="submit"
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <span>Comment</span>
                    <AiOutlineSend className="text-xl" />
                </button>
            </div>
        </form>
        {loading ? (
            <p className="text-gray-500">Loading comments...</p>
        ) : (
            <ul className="space-y-4">
                {comments.slice(0, visibleComments).map((comment) => (
                    <li key={comment.id} className="flex flex-col space-y-4">
                        <div className="flex space-x-4">
                            {renderProfilePic(comment.profilePhoto)}
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-700">{comment.userName}</p>
                                <div className="mt-1 text-gray-600">
                                {renderTextWithMentions(comment.text)}
                                </div>
                                <p className="mt-1 text-sm text-gray-400">{comment.createdAt.toLocaleString()}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    {userLikes.has(comment.id) ? (
                                        <button
                                            onClick={() => handleLike(comment.id)}
                                            className="flex items-center text-blue-500"
                                        >
                                            <AiOutlineLike className="mr-1" /> {comment.likes}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleLike(comment.id)}
                                            className="flex items-center text-gray-500 hover:text-blue-500"
                                        >
                                            <AiOutlineLike className="mr-1" /> {comment.likes}
                                        </button>
                                    )}
                                    {comment.userId === currentUser?.uid && (
                                        <>
                                            <button
                                                onClick={() => handleEdit(comment.id)}
                                                className="flex items-center text-gray-500 hover:text-green-500"
                                            >
                                                <AiFillEdit className="mr-1" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(comment.id)}
                                                className="flex items-center text-gray-500 hover:text-red-500"
                                            >
                                                <AiFillDelete className="mr-1" />
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => setReplyToCommentId(comment.id)}
                                        className="flex items-center text-gray-500 hover:text-blue-500"
                                    >
                                        Reply
                                    </button>
                                </div>
                                {replyToCommentId === comment.id && (
                                    <form onSubmit={handleReplySubmit} className="mt-4">
                                        <div className="flex space-x-4 items-start">
                                            {renderProfilePic(userProfilePic)}
                                            <MentionsInput
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                                                placeholder="Add a reply..."
                                                style={mentionStyles}
                                            >
                                                <Mention
                                                    trigger="$"
                                                    data={users.map((user) => ({ id: user.suid, display: user.name }))}
                                                    displayTransform={(id, display) => `$${display}`}
                                                />
                                            </MentionsInput>
                                        </div>
                                        <div className="flex justify-end mt-2">
                                            <button
                                                type="submit"
                                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <span>Reply</span>
                                                <AiOutlineSend className="text-xl" />
                                            </button>
                                        </div>
                                    </form>
                                )}
                                {comment.replies.length > 0 && (
                                    <ul className="space-y-4 mt-4">
                                        {comment.replies.map((reply) => (
                                            <li key={reply.id} className="flex flex-col space-y-4">
                                                <div className="flex space-x-4">
                                                    {renderProfilePic(reply.profilePhoto)}
                                                    <div className="flex-grow">
                                                        <p className="font-semibold text-gray-700">{reply.userName}</p>
                                                        <div className="mt-1 text-gray-600">
                                                            {renderTextWithMentions(reply.text)}
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-400">{reply.createdAt.toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )}
        {comments.length > visibleComments && (
            <div className="flex justify-center mt-6">
                <button
                    onClick={() => setVisibleComments((prev) => prev + 7)}
                    className="text-blue-600 hover:underline focus:outline-none"
                >
                    Read More Comments
                </button>
            </div>
        )}
    </div>
);
};

export default Comment;