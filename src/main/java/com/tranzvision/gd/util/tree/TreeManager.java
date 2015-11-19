/**
 * 
 */
package com.tranzvision.gd.util.tree;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tranzvision.gd.util.sql.SqlQuery;
import com.tranzvision.gd.util.sql.TZGDObject;

/**
 * 树管理器，原PS：TZTREEMANAGER:TreeManager
 * 
 * @author SHIHUA
 * @since 2015-11-16
 */
@Service
public class TreeManager {

	@Autowired
	private SqlQuery sqlQuery;

	@Autowired
	private TZGDObject tzSQLObject;

	/**
	 * 树名称
	 */
	private String treeName;

	/**
	 * 树根根节点对象
	 */
	private TreeNode mRootNode;

	/**
	 * 设置树名称
	 * 
	 * @param treeName
	 */
	public void setTreeName(String treeName) {
		this.treeName = treeName;
	}

	/**
	 * 打开树的方法
	 * 
	 * @param setId
	 * @return boolean
	 */
	public boolean openTree(String setId) {

		// 如果指定的树已打开，则不允许重新打开
		if (mRootNode != null) {
			return false;
		}

		try {
			String tmpRootNodeId = "";

			String sql = tzSQLObject.getSQLText("SQL.TZUtilTree.TzSelectRootNode");

			tmpRootNodeId = sqlQuery.queryForObject(sql, new Object[] { treeName }, "String");

			Date dateNow = new Date();

			TreeNode tmpRootNode = new TreeNode(setId, "", treeName, dateNow, tmpRootNodeId, "");
			// 加载树节点信息
			tmpRootNode.load(true);

			mRootNode = tmpRootNode;

		} catch (Exception e) {
			e.printStackTrace();
		}

		return false;
	}

	/**
	 * 关闭树的方法
	 * 
	 * @return boolean
	 * @throws Exception
	 */
	public boolean closeTree() throws Exception {
		if (mRootNode != null) {
			if (mRootNode.isNotSaved() == true) {
				throw new Exception("树已被修改，但尚未保存。");
			}
			mRootNode = null;
		}

		return true;
	}

	/**
	 * 在指定节点的指定位置插入新节点的方法
	 * 
	 * @param pNodeId
	 * @param nNode
	 * @param index
	 * @return boolean
	 */
	public boolean insertNode(String pNodeId, TreeNode nNode, int index) {

		String tmpPNodeId = pNodeId;

		// 判断是否已打开一颗有效的树
		if (mRootNode == null) {
			return false;
		}

		// 判断指定的父节点是否存在
		TreeNode pNode = this.find(tmpPNodeId);
		if (pNode == null) {
			return false;
		}

		// 判断要插入的新节点是否为空;
		if (nNode == null) {
			return false;
		}

		// 判断要插入的新节点是否有有效的名称
		String tmpNodeId = nNode.getTreeNode();
		if (null == tmpNodeId || "".equals(tmpNodeId)) {
			return false;
		}

		// 判断要插入的新节点是否已存在
		if (this.find(tmpNodeId) != null) {
			return false;
		}

		// 插入新节点
		return pNode.inserChildNode(nNode, index);

	}

	/**
	 * 删除指定节点的方法
	 * 
	 * @param nodeId
	 * @return boolean
	 */
	public boolean deleteNode(String nodeId) {

		if (mRootNode == null) {
			return false;
		}

		return mRootNode.deleteChildNode(nodeId);
	}

	/**
	 * 查找指定节点的方法
	 * 
	 * @param nodeId
	 * @return TreeNode
	 */
	public TreeNode find(String nodeId) {

		TreeNode retNode = null;
		String tmpNodeId = nodeId;

		if (mRootNode != null) {
			if (mRootNode.getTreeNode() == tmpNodeId) {
				retNode = mRootNode;
			} else {
				retNode = mRootNode.findChildNode(tmpNodeId);
			}
		}

		return retNode;

	}

	/**
	 * 保存树的方法
	 */
	public void save() {
		if (mRootNode != null) {

			boolean tmpRefreshNodeNum = false;
			if (mRootNode.isValidNodeNum(mRootNode.getTreeNodeNum(), mRootNode.getTreeNodeNumEnd()) == false) {
				tmpRefreshNodeNum = true;
			}

			if (mRootNode.isNotSaved() == true || tmpRefreshNodeNum == true) {
				mRootNode.save(tmpRefreshNodeNum, 1);
				mRootNode.resetSaveFlag();
			}

		}
	}

}
