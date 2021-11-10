import React, { useEffect, useState } from "react";
import { Button, Card, ListGroup, ListGroupItem } from "react-bootstrap";
import { PostModel } from '../models/postModel'
import { checkIfPostCanBeLiked, getNumLikes, likePost } from "../remote/reverb-api/likes.api";
import { Link } from "react-router-dom";
import ReverbIcon from "../assets/images/reverb_icon_final.png"

const Post = ({ shouldUpdateLikes, post, leaveComment }: 
    { shouldUpdateLikes: boolean[], post: PostModel, leaveComment: any }) => {

    const initialLikes: number = 0;
    const [canLike, setCanLike] = React.useState(false);
    const [likes, setLikes] = React.useState(initialLikes);
    

    const updateLikes = () => {
        console.log("Calling backend to update likes on post " + post.id);
        getNumLikes(post.id)
            .then(
                (data) => { setLikes(data) }
            );
    }

    const likePostFunc = () => {
        setCanLike(false);
        likePost(post.id).then(async () => {
            //instead of making another DB call, it just updates the likes by 1
            // updateLikes();
            setLikes(likes+1);
        }).catch((e) => {
            //unsuccessful
            setCanLike(true);
            console.log(e)
        })
    }

    //checks to see if the post can be liked
    //updates the number of likes
    useEffect(() => {
        updateLikes();
        checkIfPostCanBeLiked(post.id).then(canLikeReturn => setCanLike(!canLikeReturn));
    }, [shouldUpdateLikes]);

    return (
        <Card id="postCard">
            <Card.Header>
                <h3>{"" + post.title}</h3>
                <Card.Subtitle id="cardSubtitle"><Link to={`profile/${post.profile.id}`}>{"" + post.profile.first_name} {"" + post.profile.last_name}</Link></Card.Subtitle>
                <Card.Text>{"" + post.date}</Card.Text>
                <Button data-testid="reverbButton" id="reverbButton" onClick={() => likePostFunc()} variant="warning"
                    style={{ float: 'right', marginTop: "-5rem" }} disabled={!canLike}>{likes}<img id="reverbIcon" src={ReverbIcon} alt="Click to Reverb!"/></Button>
            </Card.Header>
            <Card.Body id="postBody">
                <Card.Img variant='top' src={"" + post.imageURL} />
                <Card.Text>
                    {post.postText}
                </Card.Text>
            </Card.Body>
            <ListGroup id="commentBody" className="list-group-flush">
                {post.comments.map(comment => (
                    <ListGroupItem>
                        {comment.commentText}
                        <footer id="commentFooter" style={{ float: "right", fontSize: "0.8rem", marginTop: "0.8rem" }}>
                            <Link to={`profile/${comment.profile.id}`}>{comment.profile.first_name} {comment.profile.last_name}</Link> | {comment.date}
                        </footer>
                    </ListGroupItem>
                ))}

            </ListGroup>
            <Card.Body>
                <Button data-testid="submitButton" id="leaveCommentBtn" onClick={() => leaveComment(post.id)}>Leave Comment</Button>
            </Card.Body>
        </Card>
    );
}

export default Post;
