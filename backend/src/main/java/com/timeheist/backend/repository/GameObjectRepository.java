package com.timeheist.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.timeheist.backend.entity.GameObject;


@Repository
public interface GameObjectRepository extends JpaRepository<GameObject, Long> {

}
