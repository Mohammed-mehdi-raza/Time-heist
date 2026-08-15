package com.timeheist.backend.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.timeheist.backend.entity.GameMap;

@Repository
public interface GameMapRepository extends JpaRepository<GameMap, Long> {

}
