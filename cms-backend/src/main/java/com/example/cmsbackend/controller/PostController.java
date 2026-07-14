package com.example.cmsbackend.controller;

import com.example.cmsbackend.model.Post;
import com.example.cmsbackend.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
//@CrossOrigin(origins = "*")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    // 1. CREATE: Tambah data artikel baru
    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }

    // 2. READ: Ambil semua data buat dipakai aplikasi lain
    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // 3. UPDATE: Edit artikel pakai ID
    @PutMapping("/{id}")
    public Post updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post gak ketemu dengan id: " + id));

        post.setTitle(postDetails.getTitle());
        post.setSlug(postDetails.getSlug());
        post.setContent(postDetails.getContent());
        post.setStatus(postDetails.getStatus());

        return postRepository.save(post);
    }

    // 4. DELETE: Hapus artikel pakai ID
    @DeleteMapping("/{id}")
    public String deletePost(@PathVariable Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post gak ketemu dengan id: " + id));

        postRepository.delete(post);
        return "Postingan dengan ID " + id + " berhasil dihapus!";
    }
}