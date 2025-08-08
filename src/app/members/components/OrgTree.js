"use client";

import { useState, useEffect } from 'react';
import styles from './OrgTree.module.css';
import SearchBar from './SearchBar';

const OrgTree = ({ 
  orgStructure, 
  employees, 
  selectedOrg, 
  onOrgSelect
}) => {
  // CEO와 1단계 본부들만 기본 펼침 상태로 설정
  const [expandedNodes, setExpandedNodes] = useState(new Set(['CEO']));
  const [searchTerm, setSearchTerm] = useState('');
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  // 검색어에 맞는 노드만 필터링하는 함수
  const filterNodesBySearch = (node, searchLower) => {
    // 현재 노드가 검색어와 일치하는지 확인
    const nodeMatches = node.name.toLowerCase().includes(searchLower);
    
    // 자식 노드들 중 검색어와 일치하는 것이 있는지 확인
    let hasMatchingChild = false;
    if (node.children) {
      hasMatchingChild = node.children.some(child => 
        filterNodesBySearch(child, searchLower)
      );
    }
    
    return nodeMatches || hasMatchingChild;
  };

  // 검색어가 있을 때만 필터링된 구조 반환
  const getFilteredStructure = () => {
    if (!searchTerm.trim()) {
      return orgStructure;
    }
    
    const searchLower = searchTerm.toLowerCase();
    
    // 검색어와 일치하는 노드들을 찾아서 새로운 구조 생성
    const createFilteredStructure = (node) => {
      const nodeMatches = node.name.toLowerCase().includes(searchLower);
      
      if (node.children) {
        const filteredChildren = node.children
          .map(child => createFilteredStructure(child))
          .filter(child => child !== null);
        
        // 현재 노드가 일치하거나 자식 중에 일치하는 것이 있으면 포함
        if (nodeMatches || filteredChildren.length > 0) {
          return {
            ...node,
            children: filteredChildren
          };
        }
      } else {
        // 리프 노드인 경우
        return nodeMatches ? node : null;
      }
      
      return null;
    };
    
    const filtered = createFilteredStructure(orgStructure);
    return filtered;
  };

  // 모든 노드 펼치기/접기
  const toggleAllNodes = () => {
    if (isAllExpanded) {
      // 모두 접기 - CEO만
      setExpandedNodes(new Set(['CEO']));
      setIsAllExpanded(false);
    } else {
      // 모두 펼치기
      const allNodes = new Set();
      const collectNodes = (node) => {
        allNodes.add(node.id);
        if (node.children) {
          node.children.forEach(collectNodes);
        }
      };
      collectNodes(orgStructure);
      setExpandedNodes(allNodes);
      setIsAllExpanded(true);
    }
  };

  // 노드 토글
  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
    
    // 개별 노드 토글 시 전체 펼침 상태 해제
    setIsAllExpanded(false);
  };

  // 필터 해제
  const clearFilter = () => {
    onOrgSelect(null);
  };

  // 검색어 변경 시 검색 결과에 해당하는 노드들만 펼치기
  useEffect(() => {
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      const nodesToExpand = new Set(['CEO']); // CEO는 항상 펼침
      
      // 검색어와 일치하는 노드들과 그 상위 노드들을 찾아서 펼치기
      const findMatchingNodes = (node) => {
        const nodeMatches = node.name.toLowerCase().includes(searchLower);
        let hasMatchingChild = false;
        
        if (node.children) {
          hasMatchingChild = node.children.some(child => findMatchingNodes(child));
        }
        
        // 현재 노드가 일치하거나 자식 중에 일치하는 것이 있으면 펼치기
        if (nodeMatches || hasMatchingChild) {
          nodesToExpand.add(node.id);
        }
        
        return nodeMatches || hasMatchingChild;
      };
      
      findMatchingNodes(orgStructure);
      setExpandedNodes(nodesToExpand);
      setIsAllExpanded(false); // 전체 펼침 상태는 해제
    } else {
      // 검색어가 없으면 기본 상태로 복원
      setExpandedNodes(new Set(['CEO']));
      setIsAllExpanded(false);
    }
  }, [searchTerm, orgStructure]);

  // 조직도 렌더링
  const renderOrgNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedOrg === node.name;

    return (
      <div key={node.id} className={styles.orgNode}>
        <div 
          className={`${styles.orgNodeHeader} ${isSelected ? styles.selected : ''}`}
          style={{ paddingLeft: `${level * 20 + 16}px` }}
          onClick={() => onOrgSelect(node.name)}
        >
          {hasChildren && (
            <button 
              className={styles.expandButton}
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M4.5 3L7.5 6L4.5 9" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          )}
          {!hasChildren && <div className={styles.nodeIcon} />}
          <span className={styles.nodeName}>{node.name}</span>
        </div>
        {hasChildren && isExpanded && (
          <div className={styles.nodeChildren}>
            {node.children.map(child => renderOrgNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const filteredStructure = getFilteredStructure();

  return (
    <div className={styles.container}>
      <div className={styles.searchContainer}>
        <SearchBar 
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="조직명을 입력하여 검색"
        />
      </div>

      <div className={styles.filterOptions}>
        <div className={styles.buttonGroup}>
          <button 
            className={styles.expandAllButton}
            onClick={toggleAllNodes}
          >
            {isAllExpanded ? '모두 접기' : '모두 펼치기'}
          </button>
          
          {selectedOrg && (
            <button 
              className={styles.clearFilterButton}
              onClick={clearFilter}
            >
              필터 해제
            </button>
          )}
        </div>
      </div>

      <div className={styles.orgChart}>
        {filteredStructure ? (
          renderOrgNode(filteredStructure)
        ) : (
          <div className={styles.noResults}>
            <p>검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrgTree; 